﻿namespace HomeInventory.Dtos
{
    public class Result<T> where T : class
    {
        public bool IsSuccess { get; init; }
        public T Value { get; init; }
        public string Error { get; init; }

        public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };
        public static Result<T> Failure(string error) => new() { Error = error };
    }
}
