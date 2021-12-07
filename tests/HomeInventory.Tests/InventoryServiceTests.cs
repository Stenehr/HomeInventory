using System.Linq;
using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Dtos.Inventory;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using HomeInventory.Persistance;
using HomeInventory.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace HomeInventory.Tests
{
    [TestFixture]
    public class InventoryServiceTests
    {
        private DataContext _dataContext;

        [SetUp]
        public void SetUp()
        {
            _dataContext = new DataContext(new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase("test_db")
                .Options);
        }

        [TearDown]
        public void TearDown()
        {
            _dataContext?.Dispose();
        }

        [Test]
        public async Task AddItem_AllRequiredFieldsAreFilled_CreateNewInventoryItem()
        {
            // Arrange
            var user = await GetUser();

            var itemLocation = await GetItemLocation(user);

            var userAccessorMock = new Mock<IUserAccessor>();
            userAccessorMock.Setup(x => x.GetUser()).Returns(Task.FromResult(user));
            userAccessorMock.Setup(x => x.GetUserId()).Returns(user.Id);

            var fileServiceMock = new Mock<IFileService>();

            var inventoryService = new InventoryService(_dataContext, userAccessorMock.Object, fileServiceMock.Object);

            // Act
            var result = await inventoryService.AddItem(new AddItemDto { Name = "Test", ItemLocationId = itemLocation.Id });

            // Assert
            Assert.IsTrue(result.IsSuccess);
            Assert.AreEqual(result.Value.ItemLocation.Name, itemLocation.Name);
        }

        [Test]
        public async Task EditItem_DtoHasNewImage_AddNewImageToItem()
        {
            // Arrange
            var user = await GetUser();

            var itemLocation = await GetItemLocation(user);

            var existingItem = new Item
            {
                ItemLocation = itemLocation,
                Name = "ExistingItem"
            };

            _dataContext.Items.Add(existingItem);
            await _dataContext.SaveChangesAsync();

            var userAccessorMock = new Mock<IUserAccessor>();
            userAccessorMock.Setup(x => x.GetUser()).Returns(Task.FromResult(user));
            userAccessorMock.Setup(x => x.GetUserId()).Returns(user.Id);

            var testFileName = "test.jpeg";
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(x => x.FileName).Returns(testFileName);

            var fileServiceMock = new Mock<IFileService>();
            fileServiceMock.Setup(x => x.SaveImage(fileMock.Object)).Returns(Task.FromResult(new ImageSaveResult("random")));
            fileServiceMock.Setup(x => x.GetMimeType(testFileName)).Returns(new ImageMimeTypeResult("image/jpeg"));
            fileServiceMock.Setup(x => x.GetBase64StringFromFile(It.IsAny<ItemImage>())).Returns(new ImageDisplayResult("base64"));

            var dto = new AddItemDto
            {
                ItemLocationId = itemLocation.Id,
                Image = fileMock.Object,
                RemoveImage = false
            };

            var inventoryService = new InventoryService(_dataContext, userAccessorMock.Object, fileServiceMock.Object);

            // Act
            var result = await inventoryService.EditItem(existingItem.Id, dto);

            // Assert
            fileServiceMock.Verify(x => x.SaveImage(fileMock.Object), Times.Once);
            fileServiceMock.Verify(x => x.DeletePhysicalFile(It.IsAny<ItemImage>()), Times.Never);

            Assert.IsTrue(result.IsSuccess);
            Assert.IsNotNull(result.Value.ImageDto);
            Assert.AreEqual(result.Value.ImageDto.FileName, testFileName);
        }

        [Test]
        public async Task EditItem_DtoHasNewImage_UpdatesExistingImage()
        {
            // Arrange
            var user = await GetUser();

            var itemLocation = await GetItemLocation(user);

            var existingItem = new Item
            {
                ItemLocation = itemLocation,
                Name = "ExistingItem",
                Image = new ItemImage() { FileName = "existing", RandomName = "existing" }
            };

            _dataContext.Items.Add(existingItem);
            await _dataContext.SaveChangesAsync();

            var userAccessorMock = new Mock<IUserAccessor>();
            userAccessorMock.Setup(x => x.GetUser()).Returns(Task.FromResult(user));
            userAccessorMock.Setup(x => x.GetUserId()).Returns(user.Id);

            var testFileName = "test.jpg";
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(x => x.FileName).Returns(testFileName);

            var fileServiceMock = new Mock<IFileService>();
            fileServiceMock.Setup(x => x.SaveImage(fileMock.Object)).Returns(Task.FromResult(new ImageSaveResult("random")));
            fileServiceMock.Setup(x => x.GetMimeType(It.IsAny<string>())).Returns(new ImageMimeTypeResult("image/jpeg"));
            fileServiceMock.Setup(x => x.GetBase64StringFromFile(It.IsAny<ItemImage>())).Returns(new ImageDisplayResult("base64"));

            var dto = new AddItemDto
            {
                ItemLocationId = itemLocation.Id,
                Image = fileMock.Object,
                RemoveImage = false
            };

            var inventoryService = new InventoryService(_dataContext, userAccessorMock.Object, fileServiceMock.Object);

            // Act
            var result = await inventoryService.EditItem(existingItem.Id, dto);

            // Assert
            fileServiceMock.Verify(x => x.SaveImage(fileMock.Object), Times.Once);
            fileServiceMock.Verify(x => x.DeletePhysicalFile(It.IsAny<ItemImage>()), Times.Once);

            Assert.IsTrue(result.IsSuccess);
            Assert.IsNotNull(result.Value.ImageDto);
            Assert.AreEqual(result.Value.ImageDto.FileName, testFileName);
        }

        [Test]
        public async Task EditItem_DtoHasRemoveImageTrue_RemovesExistingImage()
        {
            // Arrange
            var user = await GetUser();

            var itemLocation = await GetItemLocation(user);

            var existingItem = new Item
            {
                ItemLocation = itemLocation,
                Name = "ExistingItem",
                Image = new ItemImage() { FileName = "existing", RandomName = "existing" }
            };

            _dataContext.Items.Add(existingItem);
            await _dataContext.SaveChangesAsync();

            var userAccessorMock = new Mock<IUserAccessor>();
            userAccessorMock.Setup(x => x.GetUser()).Returns(Task.FromResult(user));
            userAccessorMock.Setup(x => x.GetUserId()).Returns(user.Id);

            var testFileName = "test.jpg";
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(x => x.FileName).Returns(testFileName);

            var fileServiceMock = new Mock<IFileService>();

            var dto = new AddItemDto
            {
                ItemLocationId = itemLocation.Id,
                Image = null,
                RemoveImage = true
            };

            var inventoryService = new InventoryService(_dataContext, userAccessorMock.Object, fileServiceMock.Object);

            // Act
            var result = await inventoryService.EditItem(existingItem.Id, dto);

            // Assert
            fileServiceMock.Verify(x => x.SaveImage(fileMock.Object), Times.Never);
            fileServiceMock.Verify(x => x.DeletePhysicalFile(It.IsAny<ItemImage>()), Times.Once);

            Assert.IsTrue(result.IsSuccess);
            Assert.IsNull(result.Value.ImageDto);
        }

        [Test]
        public async Task GetMappedLocations_MapsLocationNamesAccordinglyLevels()
        {
            // Arrange
            var user = await GetUser();

            var itemLocationBase = new ItemLocation { Name = "Test-1", User = user };
            _dataContext.ItemLocations.Add(itemLocationBase);
            await _dataContext.SaveChangesAsync();

            var itemLocationFirstChild = new ItemLocation { Name = "Test-2", User = user, ParentLocation = itemLocationBase };
            _dataContext.ItemLocations.Add(itemLocationFirstChild);
            await _dataContext.SaveChangesAsync();

            var itemLocationSecondChild = new ItemLocation { Name = "Test-3", User = user, ParentLocation = itemLocationFirstChild };
            _dataContext.ItemLocations.Add(itemLocationSecondChild);
            await _dataContext.SaveChangesAsync();

            var userAccessorMock = new Mock<IUserAccessor>();
            userAccessorMock.Setup(x => x.GetUserId()).Returns(user.Id);

            var fileServiceMock = new Mock<IFileService>();

            var inventoryService = new InventoryService(_dataContext, userAccessorMock.Object, fileServiceMock.Object);

            // Act
            var result = (await inventoryService.GetMappedLocations()).ToList();

            // Assert
            var baseDto = result.Single(i => i.Id == itemLocationBase.Id);
            Assert.AreEqual("Test-1", baseDto.Name);

            var firstChildDto = result.Single(i => i.Id == itemLocationFirstChild.Id);
            Assert.AreEqual("Test-1/Test-2", firstChildDto.Name);

            var secondChildDto = result.Single(i => i.Id == itemLocationSecondChild.Id);
            Assert.AreEqual("Test-1/Test-2/Test-3", secondChildDto.Name);
        }

        private async Task<User> GetUser()
        {
            var user = new User { UserName = "Test", Password = "Test", UserRole = UserRole.Regular };
            _dataContext.Users.Add(user);
            await _dataContext.SaveChangesAsync();

            return user;
        }

        private async Task<ItemLocation> GetItemLocation(User user)
        {
            var itemLocation = new ItemLocation { Name = "Tuba", User = user };
            _dataContext.ItemLocations.Add(itemLocation);
            await _dataContext.SaveChangesAsync();

            return itemLocation;
        }
    }
}
