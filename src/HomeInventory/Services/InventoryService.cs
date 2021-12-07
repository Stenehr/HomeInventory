using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Dtos.Inventory;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using HomeInventory.Persistance;
using Microsoft.EntityFrameworkCore;

namespace HomeInventory.Services
{
    public class InventoryService
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IFileService _fileService;

        public InventoryService(DataContext context, IUserAccessor userAccessor, IFileService fileService)
        {
            _context = context;
            _userAccessor = userAccessor;
            _fileService = fileService;
        }

        public async Task<IEnumerable<ItemViewDto>> GetItems(ItemListParams itemParams)
        {
            var items = _context.Items
                .Where(i => i.ItemLocation.User.Id == _userAccessor.GetUserId());

            var criterias = itemParams.BuildQuery();
            items = criterias.Aggregate(items, (currentItem, criteria) => currentItem.Where(criteria));

            var userItemLocations = await GetUserItemLocations();

            return (await items
                .Include(i => i.ItemLocation)
                .Include(i => i.Image)
                .Include(i => i.Condition)
                .AsNoTracking()
                .ToListAsync())
                .Select(i => MapItemToViewDto(i, userItemLocations));
        }

        public async Task<Result<ItemViewDto>> GetItem(int id)
        {
            var item = await _context.Items
                .AsNoTracking()
                .Include(i => i.ItemLocation)
                .Include(i => i.Image)
                .Include(i => i.Condition)
                .FirstOrDefaultAsync(i => i.ItemLocation.User.Id == _userAccessor.GetUserId() && i.Id == id);

            return item == null ? null : Result<ItemViewDto>.Success(MapItemToViewDto(item, await GetUserItemLocations()));
        }

        public async Task<Result<ItemViewDto>> AddItem(AddItemDto addItemDto)
        {
            var item = new Item();
            await UpdateItem(item, addItemDto);

            _context.Items.Add(item);
            var result = await _context.SaveChangesAsync() > 0;

            return result
                ? Result<ItemViewDto>.Success(MapItemToViewDto(item, await GetUserItemLocations()))
                : Result<ItemViewDto>.Failure("Esines probleeme eseme salvestamisega");
        }

        public async Task<Result<ItemViewDto>> EditItem(int id, AddItemDto addItemDto)
        {
            var item = await _context.Items
                .Include(x => x.Image)
                .Include(x => x.ItemLocation)
                .Include(x => x.Condition)
                .FirstOrDefaultAsync(x => x.ItemLocation.User.Id == _userAccessor.GetUserId() && x.Id == id);

            if (item == null)
            {
                return null;
            }

            await UpdateItem(item, addItemDto);

            var result = await _context.SaveChangesAsync() > 0;

            return result
                ? Result<ItemViewDto>.Success(MapItemToViewDto(item, await GetUserItemLocations()))
                : Result<ItemViewDto>.Failure("Esines probleeme eseme uuendamisega");
        }

        public async Task<IEnumerable<ItemLocationDto>> GetMappedLocations()
        {
            var userLocations = await GetUserItemLocations();

            return userLocations.Select(u => new ItemLocationDto(
                u.Id,
                GetLocationName(u)
                ));
        }

        public async Task<Result<ItemLocationDto>> AddItemLocation(AddItemLocationDto addItemLocationDto)
        {
            var itemLocation = new ItemLocation
            {
                Name = addItemLocationDto.Name,
                User = await _userAccessor.GetUser(),
                ParentLocation = addItemLocationDto.ParentLocationId != null
                    ? await _context.ItemLocations.FindAsync(addItemLocationDto.ParentLocationId)
                    : null
            };

            _context.ItemLocations.Add(itemLocation);
            var result = await _context.SaveChangesAsync() > 0;

            return result
                ? Result<ItemLocationDto>.Success(new ItemLocationDto(itemLocation.Id, itemLocation.Name))
                : Result<ItemLocationDto>.Failure("Esines probleeme asukoha salvestamisega");
        }

        public async Task<Result<ItemConditionDto>> AddItemCondition(AddItemConditionDto addItemConditionDto)
        {
            var itemCondition = new ItemCondition
            {
                Condition = addItemConditionDto.Condition,
                User = await _userAccessor.GetUser()
            };

            _context.ItemConditions.Add(itemCondition);
            var result = await _context.SaveChangesAsync() > 0;

            return result
                ? Result<ItemConditionDto>.Success(new ItemConditionDto(itemCondition.Id, itemCondition.Condition))
                : Result<ItemConditionDto>.Failure("Esines probleeme seisukorra salvestamisega");
        }

        public async Task<IEnumerable<ItemConditionDto>> GetItemConditionDtos() =>
            await _context.ItemConditions
                .AsNoTracking()
                .Where(i => i.User.Id == _userAccessor.GetUserId())
                .Select(i => new ItemConditionDto(i.Id, i.Condition))
                .ToListAsync();


        private async Task<List<ItemLocation>> GetUserItemLocations() =>
            await _context
                .ItemLocations
                .Include(u => u.ParentLocation)
                .Where(u => u.User.Id == _userAccessor.GetUserId())
                .ToListAsync();

        private static string GetLocationName(ItemLocation itemLocation)
        {
            if (itemLocation.ParentLocation == null)
            {
                return itemLocation.Name;
            }

            return $"{GetLocationName(itemLocation.ParentLocation)}/{itemLocation.Name}";
        }



        private async Task UpdateItem(Item item, AddItemDto addItemDto)
        {
            item.ItemLocation = await _context.ItemLocations.FindAsync(addItemDto.ItemLocationId);
            item.Description = addItemDto.Description;
            item.Name = addItemDto.Name;
            item.SerialNumber = addItemDto.SerialNumber;
            item.Condition = await _context.ItemConditions.FindAsync(addItemDto.ItemConditionId);
            item.Weight = addItemDto.Weight;

            await HandleImageUpdate(item, addItemDto);
        }

        private async Task HandleImageUpdate(Item item, AddItemDto addItemDto)
        {
            if (addItemDto.RemoveImage)
            {
                if (item.Image != null)
                {
                    _fileService.DeletePhysicalFile(item.Image);
                }

                item.Image = null;

                return;
            }

            if (addItemDto.Image != null)
            {
                var saveImageResult = await _fileService.SaveImage(addItemDto.Image);

                if (item.Image != null)
                {
                    _fileService.DeletePhysicalFile(item.Image);

                    item.Image.RandomName = saveImageResult.RandomName;
                    item.Image.FileName = addItemDto.Image.FileName;

                    return;
                }

                item.Image = new ItemImage
                {
                    FileName = addItemDto.Image.FileName,
                    RandomName = saveImageResult.RandomName
                };
            }
        }

        private ItemViewDto MapItemToViewDto(Item item, IEnumerable<ItemLocation> itemLocations)
        {
            var location = itemLocations.Single(i => i.Id == item.ItemLocation.Id);

            return new(
                item.Id,
                item.Name,
                item.SerialNumber,
                item.Description,
                item.Weight,
                item.Image != null
                    ? new ItemImageDto(
                        _fileService.GetBase64StringFromFile(item.Image)?.Base64StringImage,
                        _fileService.GetMimeType(item.Image.FileName)?.MimeType,
                        item.Image.FileName
                        )
                    : null,
                item.Condition != null ? new ItemConditionDto(item.Condition.Id, item.Condition.Condition) : null,
                new ItemLocationDto(item.ItemLocation.Id, GetLocationName(location)));
        }
    }
}