# About

This Chrome extension retrieves the address of a property from Realestate.com.au, sends the address information to LocationIQ to obtain the coordinates, and uses these coordinates to query the School Finder for the primary school in the catchment area of the address.

This extension was developed because the Realestate.com.au data regarding primary school catchments is not accurate.

[Chrome Web Store link](https://chromewebstore.google.com/detail/reschoolfinder/jcopbkngndkdlppfpcfojnpddoaalbej?utm_source=ext_app_menu)

## Data Sources

### NSW Schools

[NSW Public Schools Master Dataset](https://data.nsw.gov.au/data/dataset/nsw-education-nsw-public-schools-master-dataset/resource/b0026f18-2f23-4837-968c-959e5fb3311d)

### NSW School Catchments

[NSW Education School Intake Zones - Catchment Areas for NSW Government Schools](https://data.nsw.gov.au/data/dataset/nsw-education-school-intake-zones-catchment-areas-for-nsw-government-schools/resource/32d6f502-ddb1-45d9-b114-5e34ddfd33ac)

## Convert to GeoJSON File

To convert the school catchment shapefile to a GeoJSON file, use the following command:

```bash
ogr2ogr -f GeoJSON catchments_primary.geojson catchments_primary.shp
