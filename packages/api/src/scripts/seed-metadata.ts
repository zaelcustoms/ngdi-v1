import { prisma } from "../lib/prisma"

async function main() {
  console.log("Starting to seed metadata...")

  // Get the admin user to use as creator for the metadata entries
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@ngdi.gov.ng" },
  })

  if (!adminUser) {
    console.error("Admin user not found. Please run seed-users.ts first.")
    process.exit(1)
  }

  // Sample metadata entries
  const sampleMetadata = [
    {
      title: "Nigeria Administrative Boundaries",
      author: "NGDI Geospatial Division",
      organization: "Nigeria Geospatial Data Infrastructure",
      dateFrom: "2022-01-01",
      dateTo: "2022-12-31",
      abstract:
        "Comprehensive dataset of administrative boundaries across Nigeria, including state, LGA, and ward boundaries. Updated with the latest demarcations as of December 2022.",
      purpose:
        "To provide accurate reference data for governance, planning, and spatial analysis across Nigerian territories.",
      thumbnailUrl: "https://example.com/thumbnails/admin-boundaries.png",
      imageName: "admin-boundaries.png",
      frameworkType: "Vector",
      categories: ["administrativeBoundaries", "governmentData"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 32N",
      scale: 50000,
      resolution: "10m",
      accuracyLevel: "High",
      completeness: 98,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "Shapefile",
      fileSize: 245000000,
      numFeatures: 1256,
      softwareReqs: "QGIS 3.0+, ArcGIS 10.5+",
      updateCycle: "Annually",
      distributionFormat: "Shapefile, GeoJSON",
      accessMethod: "Direct Download",
      downloadUrl: "https://data.ngdi.gov.ng/datasets/admin-boundaries.zip",
      apiEndpoint: "https://api.ngdi.gov.ng/v1/boundaries",
      licenseType: "NGDI Open Data License",
      usageTerms: "Attribution required. No commercial use without permission.",
      attributionRequirements:
        "Data source: Nigeria Geospatial Data Infrastructure (NGDI)",
      accessRestrictions: [
        "Authentication Required",
        "API Key Required for Bulk Access",
      ],
      contactPerson: "Dr. Aisha Mohammed",
      email: "data@ngdi.gov.ng",
      department: "Geospatial Division",
      userId: adminUser.id,
    },
    {
      title: "Lagos State High-Resolution Satellite Imagery",
      author: "Lagos State Geographic Information Systems",
      organization: "Lagos State Government",
      dateFrom: "2023-03-15",
      dateTo: "2023-04-20",
      abstract:
        "High-resolution satellite imagery covering the entire Lagos State area captured during the dry season with less than 5% cloud cover. Resolution of 50cm per pixel.",
      purpose:
        "Urban planning, infrastructure development, and environmental monitoring across Lagos metropolitan area.",
      thumbnailUrl: "https://example.com/thumbnails/lagos-imagery.png",
      imageName: "lagos-imagery.png",
      frameworkType: "Raster",
      categories: ["digitalImagery", "urbanPlanning"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 31N",
      scale: 10000,
      resolution: "50cm",
      accuracyLevel: "Very High",
      completeness: 95,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "GeoTIFF",
      fileSize: 2147483647,
      softwareReqs: "QGIS 3.0+, ERDAS IMAGINE 2020+",
      updateCycle: "Bi-Annually",
      distributionFormat: "GeoTIFF, ECW",
      accessMethod: "Tile Server",
      downloadUrl: "https://data.lagosstate.gov.ng/imagery/2023/bundle.zip",
      apiEndpoint: "https://tiles.lagosstate.gov.ng/wmts",
      licenseType: "Lagos State GIS License",
      usageTerms:
        "Academic and government use only. Commercial licensing available separately.",
      attributionRequirements:
        "Data source: Lagos State Geographic Information Systems (LAGIS)",
      accessRestrictions: [
        "Authentication Required",
        "Usage Reporting Required",
      ],
      contactPerson: "Michael Adebayo",
      email: "gis@lagosstate.gov.ng",
      department: "Geographic Information Systems",
      userId: adminUser.id,
    },
    {
      title: "Nigeria Population Density 2023",
      author: "National Population Commission",
      organization: "National Population Commission of Nigeria",
      dateFrom: "2023-01-01",
      dateTo: "2023-12-31",
      abstract:
        "Population density estimates across Nigeria based on the 2023 census data, showing population concentration per square kilometer at LGA level.",
      purpose:
        "Supporting demographic analysis, policy planning, and resource allocation based on population distribution.",
      thumbnailUrl: "https://example.com/thumbnails/population-density.png",
      imageName: "population-density.png",
      frameworkType: "Vector",
      categories: ["demographicData", "censusData"],
      coordinateSystem: "WGS 84",
      projection: "Geographic",
      scale: 100000,
      resolution: null,
      accuracyLevel: "Medium",
      completeness: 100,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "GeoJSON",
      fileSize: 15000000,
      numFeatures: 774,
      softwareReqs: "Any GIS software supporting GeoJSON",
      updateCycle: "Annually",
      distributionFormat: "GeoJSON, CSV with coordinates",
      accessMethod: "API, Direct Download",
      downloadUrl: "https://data.population.gov.ng/datasets/density-2023.zip",
      apiEndpoint: "https://api.population.gov.ng/v1/density",
      licenseType: "Nigeria Government Open Data License",
      usageTerms: "Free for all uses with attribution",
      attributionRequirements:
        "Data source: National Population Commission of Nigeria (NPopC)",
      accessRestrictions: [],
      contactPerson: "Dr. Samuel Akinyemi",
      email: "data@population.gov.ng",
      department: "Data Analytics",
      userId: adminUser.id,
    },
    {
      title: "Nigeria Flood Risk Zones 2023",
      author: "Nigeria Hydrological Services Agency",
      organization: "Nigeria Hydrological Services Agency",
      dateFrom: "2023-05-01",
      dateTo: "2023-11-30",
      abstract:
        "Comprehensive mapping of flood risk zones across Nigeria based on 2023 rainfall patterns, river levels, and terrain analysis. Includes risk categories from low to extremely high.",
      purpose:
        "Disaster preparedness, urban planning, insurance risk assessment, and emergency response planning.",
      thumbnailUrl: "https://example.com/thumbnails/flood-risk.png",
      imageName: "flood-risk.png",
      frameworkType: "Vector",
      categories: ["hydrographicData", "disasterManagement"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 32N",
      scale: 25000,
      resolution: null,
      accuracyLevel: "High",
      completeness: 92,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "Shapefile",
      fileSize: 178000000,
      numFeatures: 2352,
      softwareReqs: "QGIS 3.0+, ArcGIS 10.5+",
      updateCycle: "Annually",
      distributionFormat: "Shapefile, GeoPackage",
      accessMethod: "Direct Download",
      downloadUrl: "https://data.nihsa.gov.ng/datasets/flood-risk-2023.zip",
      apiEndpoint: "https://api.nihsa.gov.ng/v1/flood-risk",
      licenseType: "NIHSA Data License",
      usageTerms:
        "Free for non-commercial use. Commercial use requires written permission.",
      attributionRequirements:
        "Data source: Nigeria Hydrological Services Agency (NIHSA)",
      accessRestrictions: ["Authentication Required"],
      contactPerson: "Dr. Emmanuel Adewale",
      email: "data@nihsa.gov.ng",
      department: "Hydrological Modeling",
      userId: adminUser.id,
    },
    {
      title: "Nigeria Road Network 2023",
      author: "Federal Ministry of Works and Housing",
      organization: "Federal Ministry of Works and Housing",
      dateFrom: "2023-01-01",
      dateTo: "2023-12-31",
      abstract:
        "Comprehensive road network dataset for Nigeria including federal highways, state roads, and major urban roads. Includes road classification, surface type, and condition attributes.",
      purpose:
        "Transportation planning, logistics optimization, and infrastructure development projects.",
      thumbnailUrl: "https://example.com/thumbnails/road-network.png",
      imageName: "road-network.png",
      frameworkType: "Vector",
      categories: ["transportationData", "infrastructureData"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 32N",
      scale: 50000,
      resolution: null,
      accuracyLevel: "High",
      completeness: 90,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "Shapefile",
      fileSize: 320000000,
      numFeatures: 15782,
      softwareReqs: "QGIS 3.0+, ArcGIS 10.5+",
      updateCycle: "Bi-Annually",
      distributionFormat: "Shapefile, GeoJSON",
      accessMethod: "Direct Download, WFS",
      downloadUrl: "https://data.fmw.gov.ng/datasets/roads-2023.zip",
      apiEndpoint: "https://api.fmw.gov.ng/v1/roads",
      licenseType: "Nigeria Government Open Data License",
      usageTerms: "Free for all uses with attribution",
      attributionRequirements:
        "Data source: Federal Ministry of Works and Housing, Nigeria",
      accessRestrictions: [],
      contactPerson: "Engr. Biodun Oladipo",
      email: "gis@fmw.gov.ng",
      department: "GIS Unit",
      userId: adminUser.id,
    },
    {
      title: "Nigeria National Parks and Protected Areas",
      author: "National Park Service",
      organization: "Nigeria National Park Service",
      dateFrom: "2022-06-01",
      dateTo: "2023-06-30",
      abstract:
        "Boundaries and attribute information for all national parks, game reserves, and protected areas in Nigeria. Includes conservation status, biodiversity indices, and management information.",
      purpose:
        "Conservation planning, environmental impact assessment, and ecotourism development.",
      thumbnailUrl: "https://example.com/thumbnails/protected-areas.png",
      imageName: "protected-areas.png",
      frameworkType: "Vector",
      categories: ["landUseLandCover", "environmentData"],
      coordinateSystem: "WGS 84",
      projection: "Geographic",
      scale: 100000,
      resolution: null,
      accuracyLevel: "Medium",
      completeness: 100,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "Shapefile",
      fileSize: 82000000,
      numFeatures: 147,
      softwareReqs: "Any GIS software supporting Shapefile format",
      updateCycle: "Annually",
      distributionFormat: "Shapefile, KML",
      accessMethod: "Direct Download",
      downloadUrl: "https://data.nnps.gov.ng/datasets/protected-areas.zip",
      apiEndpoint: null,
      licenseType: "Creative Commons Attribution 4.0",
      usageTerms: "Free for all uses with attribution",
      attributionRequirements:
        "Data source: Nigeria National Park Service (NNPS)",
      accessRestrictions: [],
      contactPerson: "Dr. Fatima Ibrahim",
      email: "conservation@nnps.gov.ng",
      department: "Conservation Data Management",
      userId: adminUser.id,
    },
    {
      title: "Nigeria Soil Types",
      author: "Institute of Soil Science",
      organization: "Federal Ministry of Agriculture and Rural Development",
      dateFrom: "2021-01-01",
      dateTo: "2022-12-31",
      abstract:
        "Comprehensive soil classification map of Nigeria showing major soil types, textures, and agricultural suitability. Based on extensive field sampling and laboratory analysis.",
      purpose:
        "Agricultural planning, land management, and environmental assessment.",
      thumbnailUrl: "https://example.com/thumbnails/soil-types.png",
      imageName: "soil-types.png",
      frameworkType: "Vector",
      categories: ["geologicalData", "agriculturalData"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 32N",
      scale: 250000,
      resolution: null,
      accuracyLevel: "Medium",
      completeness: 95,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "Shapefile",
      fileSize: 145000000,
      numFeatures: 326,
      softwareReqs: "QGIS 3.0+, ArcGIS 10.5+",
      updateCycle: "Every 5 years",
      distributionFormat: "Shapefile, GeoTIFF",
      accessMethod: "Direct Download",
      downloadUrl: "https://data.fmard.gov.ng/datasets/soil-types.zip",
      apiEndpoint: null,
      licenseType: "Nigeria Government Open Data License",
      usageTerms:
        "Free for academic and non-commercial use. Commercial use requires registration.",
      attributionRequirements:
        "Data source: Institute of Soil Science, Federal Ministry of Agriculture, Nigeria",
      accessRestrictions: ["Commercial Use Registration Required"],
      contactPerson: "Prof. Yusuf Adamu",
      email: "soils@fmard.gov.ng",
      department: "Soil Science Division",
      userId: adminUser.id,
    },
    {
      title: "Abuja Digital Elevation Model",
      author: "FCT Survey and Mapping Department",
      organization: "Federal Capital Territory Administration",
      dateFrom: "2023-01-01",
      dateTo: "2023-03-31",
      abstract:
        "High-resolution digital elevation model (DEM) of the Federal Capital Territory, Abuja. Derived from LiDAR data with 1-meter resolution.",
      purpose:
        "Urban planning, flood modeling, infrastructure development, and viewshed analysis.",
      thumbnailUrl: "https://example.com/thumbnails/abuja-dem.png",
      imageName: "abuja-dem.png",
      frameworkType: "Raster",
      categories: ["topographicData", "elevation"],
      coordinateSystem: "WGS 84",
      projection: "UTM Zone 32N",
      scale: 5000,
      resolution: "1m",
      accuracyLevel: "Very High",
      completeness: 99,
      consistencyCheck: true,
      validationStatus: "Validated",
      fileFormat: "GeoTIFF",
      fileSize: 2147483647,
      softwareReqs: "QGIS 3.0+, ArcGIS 10.5+, Global Mapper 20+",
      updateCycle: "Every 3 years",
      distributionFormat: "GeoTIFF, ASCII Grid",
      accessMethod: "Direct Download",
      downloadUrl: "https://data.fct.gov.ng/datasets/dem-2023.zip",
      apiEndpoint: null,
      licenseType: "FCT Geospatial Data License",
      usageTerms:
        "Free for government use. Academic and commercial use requires registration and fee.",
      attributionRequirements:
        "Data source: FCT Survey and Mapping Department, Abuja, Nigeria",
      accessRestrictions: [
        "Authentication Required",
        "Fee Required for Commercial Use",
      ],
      contactPerson: "Engr. Suleiman Abba",
      email: "gis@fct.gov.ng",
      department: "Survey and Mapping",
      userId: adminUser.id,
    },
  ]

  // Check for existing metadata to avoid duplicates
  const existingMetadata = await prisma.metadata.findMany({
    select: { title: true },
  })
  const existingTitles = new Set(existingMetadata.map((m) => m.title))

  // Create new metadata entries, skipping any that already exist
  let createdCount = 0
  for (const metadata of sampleMetadata) {
    if (existingTitles.has(metadata.title)) {
      console.log(`Skipping existing metadata: ${metadata.title}`)
      continue
    }

    await prisma.metadata.create({
      data: metadata,
    })
    console.log(`Created metadata: ${metadata.title}`)
    createdCount++
  }

  console.log(
    `Seeding completed. Created ${createdCount} new metadata entries.`
  )
}

main()
  .then(() => console.log("Metadata seeding completed."))
  .catch((e) => {
    console.error("Error during metadata seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
