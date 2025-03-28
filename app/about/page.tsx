import { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "About NGDI | National Geo-Spatial Data Infrastructure",
  description:
    "Learn about the National Geo-Spatial Data Infrastructure (NGDI), a strategic initiative for geospatial data management in Nigeria.",
}

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto">
          <div className="space-y-2 mb-6">
            <Badge variant="outline" className="mb-2">
              About Us
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              About NGDI
            </h1>
            <p className="text-xl text-muted-foreground">
              Creating a unified framework for geospatial data in Nigeria
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="bg-card rounded-lg p-6 border shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="lead text-lg">
                The National Geo-Spatial Data Infrastructure (NGDI) is a
                strategic initiative aimed at creating a unified framework for
                geospatial data production, management, sharing, and utilization
                in Nigeria. With geospatial information underpinning
                approximately 80% of planning and decision-making processes, the
                NGDI addresses the need for accurate, accessible, and
                interoperable geospatial datasets across all sectors of the
                economy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="overflow-hidden hover:shadow-md transition-shadow animate-in fade-in slide-in-from-left-4 duration-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground">
                    To optimize the use of geospatial data as a critical
                    resource for sustainable development and efficient service
                    delivery.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-shadow animate-in fade-in slide-in-from-right-4 duration-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground">
                    To establish institutional, legal, technical, and
                    administrative frameworks for coordinating the production,
                    sharing, and dissemination of standardized geospatial data
                    across all levels of governance in Nigeria.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">
                  Objectives
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {[
                    "Facilitate collaboration among geospatial data producers, managers, and users",
                    "Promote standardized data collection and dissemination mechanisms",
                    "Eliminate duplication in data acquisition and maintenance, improving cost-efficiency",
                    "Ensure the availability of core datasets to support national planning, disaster management, and economic growth",
                    "Build capacity and promote research in geospatial technologies",
                    "Encourage indigenous innovation in geospatial applications",
                  ].map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">
                  Core Components
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <ComponentSection
                    title="Funding"
                    items={[
                      "Annual budgetary allocations from the Federal Government of Nigeria",
                      "Grants and technical assistance from international development partners",
                      "Public-private partnerships for sustainable financing of geospatial data infrastructure",
                      "Cost recovery mechanisms through data services and specialized products",
                    ]}
                  />

                  <ComponentSection
                    title="Governance"
                    items={[
                      "A National NGDI Council chaired by the Vice President of Nigeria provides strategic oversight",
                      "The Council is supported by a multidisciplinary NGDI Committee comprising representatives from federal ministries, private sectors, academia, and NGOs",
                      "NASRDA serves as the coordinating agency, ensuring policy implementation and stakeholder engagement",
                    ]}
                  />

                  <ComponentSection
                    title="Data Standards and Interoperability"
                    items={[
                      "Adoption of Open Geospatial Consortium (OGC) standards to ensure data compatibility across systems",
                      "Development of national geospatial data guidelines for data collection, storage, and sharing",
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="grid grid-cols-1 gap-4">
                <ComponentSection
                  title="Metadata and Clearinghouse Services"
                  items={[
                    "Establishment of metadata catalogs and clearing houses to enable data discoverability and easy access",
                    "Regular updates to metadata to maintain data relevance and usability",
                  ]}
                />

                <ComponentSection
                  title="Open Access and Data Security"
                  items={[
                    "Open access policies for non-restricted datasets to encourage innovation",
                    "Secure systems to protect classified data and ensure intellectual property rights compliance",
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ComponentSection
                  title="Fundamental Datasets"
                  description="Creation and maintenance of core geospatial datasets, including:"
                  items={[
                    "Administrative boundaries",
                    "Topography and elevation",
                    "Land use and land cover",
                    "Transportation networks",
                    "Satellite imageries and image maps",
                    "Hydrological data (rivers, lakes, watersheds)",
                    "Population demographics and distribution",
                    "Cadastral information and land registry",
                    "Infrastructure and utilities networks",
                    "Soil and geological data",
                    "Environmental and ecological zones",
                    "Climate and meteorological data",
                    "Natural resources and mineral deposits",
                    "Cultural and heritage sites",
                    "Emergency management and disaster risk zones",
                  ]}
                />

                <ComponentSection
                  title="Capacity Building and Public Awareness"
                  items={[
                    "Training programs for nodal agencies to enhance technical expertise in geospatial data management and analysis",
                    "Specialized workshops for NGDI Committee members on policy development and implementation strategies",
                    "Technical skills development for government officials across federal, state, and local levels",
                    "Academic collaborations to integrate geospatial education into university curricula",
                    "End-user training sessions for public and private sector stakeholders",
                    "Public awareness campaigns to highlight the importance of geospatial data in daily life and national development",
                    "Regular knowledge sharing forums to exchange best practices and innovations in geospatial technologies",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentSection({
  title,
  description,
  items,
}: {
  title: string
  description?: string
  items: string[]
}) {
  return (
    <div className="bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      {description && (
        <p className="mb-2 text-muted-foreground text-sm">{description}</p>
      )}
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <ChevronRight className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
