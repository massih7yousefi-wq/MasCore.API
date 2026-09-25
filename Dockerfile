FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY MasCore.API/MasCore.API.csproj MasCore.API/

RUN dotnet restore MasCore.API/MasCore.API.csproj

COPY MasCore.API/ MasCore.API/

WORKDIR /src/MasCore.API

RUN dotnet publish MasCore.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "MasCore.API.dll"]