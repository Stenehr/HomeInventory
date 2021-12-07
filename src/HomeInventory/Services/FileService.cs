using System;
using System.IO;
using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;

namespace HomeInventory.Services
{
    public interface IFileService
    {
        ImageDisplayResult GetBase64StringFromFile(ItemImage itemImage);
        void DeletePhysicalFile(ItemImage itemImage);
        ImageMimeTypeResult GetMimeType(string filename);
        Task<ImageSaveResult> SaveImage(IFormFile file);
    }

    public class FileService : IFileService
    {
        private readonly FileSettings _fileSettings;
        private readonly ILogger<FileService> _logger;

        public FileService(FileSettings fileSettings, ILogger<FileService> logger)
        {
            _fileSettings = fileSettings;
            _logger = logger;
        }

        public ImageDisplayResult GetBase64StringFromFile(ItemImage itemImage)
        {
            if (itemImage == null)
            {
                return null;
            }

            var bytes = File.ReadAllBytes(Path.Combine(_fileSettings.AbsoluteBasePath, itemImage.RandomName));
            return new ImageDisplayResult(Convert.ToBase64String(bytes));
        }

        public void DeletePhysicalFile(ItemImage itemImage)
        {
            var filePath = Path.Combine(_fileSettings.AbsoluteBasePath, itemImage.RandomName);

            try
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public ImageMimeTypeResult GetMimeType(string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                return null;
            }

            var provider = new FileExtensionContentTypeProvider();
            provider.TryGetContentType(filename, out var contentType);

            return new ImageMimeTypeResult(contentType);
        }

        public async Task<ImageSaveResult> SaveImage(IFormFile file)
        {
            if (file == null)
            {
                return null;
            }

            var randomName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var savePath = Path.Combine(_fileSettings.AbsoluteBasePath, randomName);

            await using var fileStream = new FileStream(savePath, FileMode.Create);
            await file.CopyToAsync(fileStream);

            return new ImageSaveResult(randomName);
        }
    }
}
