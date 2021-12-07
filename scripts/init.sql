IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

CREATE TABLE [ItemImage] (
    [Id] int NOT NULL IDENTITY,
    [RandomName] nvarchar(100) NOT NULL,
    [FileName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_ItemImage] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [UserName] nvarchar(50) NOT NULL,
    [Password] nvarchar(100) NOT NULL,
    [UserRole] int NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [ItemConditions] (
    [Id] int NOT NULL IDENTITY,
    [Condition] nvarchar(100) NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_ItemConditions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ItemConditions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [ItemLocations] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [UserId] int NOT NULL,
    [ParentLocationId] int NULL,
    CONSTRAINT [PK_ItemLocations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ItemLocations_ItemLocations_ParentLocationId] FOREIGN KEY ([ParentLocationId]) REFERENCES [ItemLocations] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_ItemLocations_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Items] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [SerialNumber] nvarchar(100) NULL,
    [ImageId] int NULL,
    [Description] nvarchar(max) NULL,
    [ItemLocationId] int NOT NULL,
    [ConditionId] int NULL,
    [Weight] float NULL,
    CONSTRAINT [PK_Items] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Items_ItemConditions_ConditionId] FOREIGN KEY ([ConditionId]) REFERENCES [ItemConditions] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Items_ItemImage_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [ItemImage] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Items_ItemLocations_ItemLocationId] FOREIGN KEY ([ItemLocationId]) REFERENCES [ItemLocations] ([Id]) ON DELETE CASCADE
);
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Password', N'UserName', N'UserRole') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([Id], [Password], [UserName], [UserRole])
VALUES (1, N'AIgvkztRefz+fAZsC0H1TUsBiJLJl2XsRMl1sQlVBV89qGDh/fc5EGRPi9th9i+AOA==', N'admin', 0);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Password', N'UserName', N'UserRole') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;
GO

CREATE INDEX [IX_ItemConditions_UserId] ON [ItemConditions] ([UserId]);
GO

CREATE INDEX [IX_ItemLocations_ParentLocationId] ON [ItemLocations] ([ParentLocationId]);
GO

CREATE INDEX [IX_ItemLocations_UserId] ON [ItemLocations] ([UserId]);
GO

CREATE INDEX [IX_Items_ConditionId] ON [Items] ([ConditionId]);
GO

CREATE INDEX [IX_Items_ImageId] ON [Items] ([ImageId]);
GO

CREATE INDEX [IX_Items_ItemLocationId] ON [Items] ([ItemLocationId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20211207183720_Initial', N'5.0.12');
GO

