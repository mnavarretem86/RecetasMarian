FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

COPY *.sln ./
COPY CAPA_DATOS/*.csproj CAPA_DATOS/
COPY CAPA_ENTIDADES/*.csproj CAPA_ENTIDADES/
COPY CAPA_NEGOCIO/*.csproj CAPA_NEGOCIO/
COPY CookBook.API/*.csproj CookBook.API/

RUN dotnet restore

COPY . ./

WORKDIR /app/CookBook.API
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build-env /app/CookBook.API/out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "CookBook.API.dll"]