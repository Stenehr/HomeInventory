using System.Collections.Generic;
using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Dtos.Inventory;
using HomeInventory.Models;
using HomeInventory.Services;
using Microsoft.AspNetCore.Mvc;

namespace HomeInventory.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryService _inventoryService;

        public InventoryController(InventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemViewDto>>> GetItems([FromQuery] ItemListParams itemParams) =>
            Ok(await _inventoryService.GetItems(itemParams));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ItemViewDto>> GetItem(int id) =>
            HandleResult(await _inventoryService.GetItem(id));

        [HttpPost]
        public async Task<ActionResult<ItemViewDto>> Create([FromForm] AddItemDto dto) =>
            HandleResult(await _inventoryService.AddItem(dto));

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ItemViewDto>> Edit(int id, [FromForm] AddItemDto dto) =>
            HandleResult(await _inventoryService.EditItem(id, dto));

        [HttpPost("item-location")]
        public async Task<ActionResult<ItemLocationDto>> CreateItemLocation(AddItemLocationDto dto) =>
            HandleResult(await _inventoryService.AddItemLocation(dto));

        [HttpGet("item-location")]
        public async Task<ActionResult<IEnumerable<ItemLocationDto>>> GetItemLocations() =>
            Ok(await _inventoryService.GetMappedLocations());

        [HttpPost("item-condition")]
        public async Task<ActionResult<ItemConditionDto>> CreateItemCondition(AddItemConditionDto dto) =>
            HandleResult(await _inventoryService.AddItemCondition(dto));

        [HttpGet("item-condition")]
        public async Task<ActionResult<IEnumerable<ItemConditionDto>>> GetItemConditions() =>
            Ok(await _inventoryService.GetItemConditionDtos());

        private ActionResult<T> HandleResult<T>(Result<T> result) where T : class
        {
            if (result == null || (result.IsSuccess && result.Value == null))
                return NotFound();
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}
