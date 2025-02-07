"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { UserRole, Permissions } from "@/lib/auth/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Building2,
  Users,
  FileText,
  MoreHorizontal,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react"

// Mock data - replace with actual API call
const mockOrganizations = [
  {
    id: "1",
    name: "Federal Ministry of Environment",
    type: "Federal Ministry",
    location: "Abuja",
    nodeOfficers: 5,
    totalUsers: 25,
    metadataCount: 245,
    status: "Active",
    lastActive: "2024-02-05",
    contact: {
      email: "info@environment.gov.ng",
      phone: "+234 123 456 7890",
      website: "www.environment.gov.ng",
      address: "Federal Secretariat Complex, Abuja",
    },
  },
  {
    id: "2",
    name: "National Space Research and Development Agency",
    type: "Federal Agency",
    location: "Abuja",
    nodeOfficers: 3,
    totalUsers: 15,
    metadataCount: 189,
    status: "Active",
    lastActive: "2024-02-05",
    contact: {
      email: "info@nasrda.gov.ng",
      phone: "+234 123 456 7891",
      website: "www.nasrda.gov.ng",
      address: "Obasanjo Space Center, Airport Road, Abuja",
    },
  },
]

const organizationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Organization type is required.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function OrganizationsPage() {
  const { user, can } = useAuth({
    // TODO: Replace with actual user data
    user: {
      id: "1",
      email: "user@example.com",
      role: UserRole.ADMIN,
      organizationId: "1",
    },
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [organizations] = useState(mockOrganizations)
  const [selectedOrg, setSelectedOrg] = useState<
    (typeof mockOrganizations)[0] | null
  >(null)

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      address: "",
    },
  })

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function onSubmit(data: OrganizationFormValues) {
    // TODO: Implement organization creation/update
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {can(Permissions.MANAGE_ORGANIZATION) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Organization</DialogTitle>
                <DialogDescription>
                  Add a new organization to the NGDI portal.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter organization name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="federal-ministry">
                                Federal Ministry
                              </SelectItem>
                              <SelectItem value="federal-agency">
                                Federal Agency
                              </SelectItem>
                              <SelectItem value="state-ministry">
                                State Ministry
                              </SelectItem>
                              <SelectItem value="research">
                                Research Institution
                              </SelectItem>
                              <SelectItem value="ngo">NGO</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Contact email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Organization website"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Full address"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create Organization</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="relative">
            {can(Permissions.MANAGE_ORGANIZATION) && (
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {org.name}
              </CardTitle>
              <CardDescription>{org.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      Node Officers
                    </div>
                    <p className="text-lg font-semibold">{org.nodeOfficers}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-1 h-4 w-4" />
                      Metadata
                    </div>
                    <p className="text-lg font-semibold">{org.metadataCount}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {org.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {org.contact.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {org.contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {org.contact.website}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Badge
                    variant={org.status === "Active" ? "default" : "secondary"}
                    className="bg-ngdi-green-500"
                  >
                    {org.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last active: {org.lastActive}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
