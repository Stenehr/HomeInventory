## Konfiguratsioon

src\HomeInventory\appsettings.json failis

1. Elemendi "ConnectionStrings" sees tuleks määrata "DefaultConnection" vastu oma lokaalset baasi.
2. Elemendi "FileSettings" sees tuleks määrata "AbsoluteBasePath" - koht kuhu salvestatakse pildid.

## Baasi loomine

1. Kui on installid dotnet-ef toolid võib kasutada neid andmebaasi loomiseks. Jooksutades projekti root kasutas käsurealt "dotnet ef database update -s src\HomeInventory" või navigeerides src\HomeInventory kausta ja jooksutades "dotnet ef database update"
2. Kui EF ei kasuta on võimalus luua andmebaas käsitsi ja jooksutada seal init scripti, mis asub root kaustas "script\init.sql". Baasi nimi peaks olema sama, mis appsettings.json failis sai määratud "DefaultConnection" osas "Initial Catalog"i väärtuseks.

## Käivitamine

1. Reacti poolne osa on builditud juba rakenduse wwwroot kausta, et piisab src\HomeInventory kaustas "dotnet run" käsu kasutamisest - navigeerides brauseris https://localhost:5001 peaks avanema esileht.
2. Kui reacti rakendust eraldi vaja jooksutada on, siis on tarvis node ja npm olemasolu. Tuleks veebiprojekt tööle panna nagu step 1 kirjeldatud. src\home-inventory-client kaustas kõigepealt käsurealt jooksutada "npm install", et vajalikud pakid installida. Kui pakid installitud jooksutada käsurealt "npm run" seejärel võib navigeerida brauseris http://localhost:3000

## Muu info

Admin kasutaja kasutajanimi ja parool on admin
