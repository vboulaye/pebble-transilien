# pebble transports

pebblejs application that retrieve  next stops on transilien stations.

RATP stations using https://github.com/pgrimaud/horaires-ratp-api 

SNCF stations using the "OPEN DATA TRANSILIEN PROCHAINS DEPARTS" api
- Request an  api key login/password by email : https://ressources.data.sncf.com/explore/dataset/api-temps-reel-transilien/
- Retrieve the database of stations from https://ressources.data.sncf.com/explore/dataset/sncf-gares-et-arrets-transilien-ile-de-france/information/?sort=libelle: 
```
curl "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=sncf-gares-et-arrets-transilien-ile-de-france&rows=1000" >src/pkjs/card-sncf-gares.json
```