import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { FiPlusCircle } from "react-icons/fi";
import { offerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"

export function CreateOfferDialog({ onCreate,openState,setOpen }: { onCreate: (offer: any) => void, openState: boolean, setOpen: (open: boolean) => void }) {
  const [form, setForm] = useState({
    operator: "",
    title: "",
    description: "",
    price: "",
    ussd: "",
    image: "" 
  })
  const [errors, setErrors] = useState({})

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
     setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function resetForm() {
    setForm({
      operator: "",
      title: "",
      description: "",
      price: "",
      ussd: "",
      image: ""
    })
    setErrors({})
  }

  function handleSubmit() {
    const result = offerSchema.safeParse(form)

    if (!result.success) {
    // Extract and show first error message
   const fieldErrors = result.error.flatten().fieldErrors
    setErrors(fieldErrors)
    console.log(errors);
    
    // toast.error(firstError || "Invalid form input")
    return
  }
    onCreate(form)
    resetForm() 
  }

  return (
    <Dialog open={openState} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-[#0D5256]'><FiPlusCircle className="h-5 w-5" color="white"/>Create Offer</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#0D5256]">Create New Offer</DialogTitle>
          <DialogDescription>
            Add a new offer, fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operator" className="text-right">
              Operator *
            </Label>
            <Select value={form.operator} onValueChange={v => handleChange("operator", v)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Choose operator" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="Djezzy">Djezzy</SelectItem>
                <SelectItem value="Mobilis">Mobilis</SelectItem>
                <SelectItem value="Ooredoo">Ooredoo</SelectItem>
              </SelectContent>
            </Select>
            {errors.operator && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.operator}</p>
          )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Offer Title *
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
              className="col-span-3"
              placeholder="Title"
            />
            {errors.title && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.title}</p>
          )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description *
            </Label>
            <Input
              id="description"
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              className="col-span-3"
              placeholder="Offer details"
            />
            {errors.description && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.description}</p>
          )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price (DZD) *
            </Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={e => handleChange("price", e.target.value)}
              className="col-span-3"
            />
            {errors.price && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.price}</p>
          )}
          </div>

           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              USSD Code *
            </Label>
            <Input
              id="ussd"
              value={form.ussd}
              onChange={e => handleChange("ussd", e.target.value)}
              className="col-span-3"
            />
            {errors.ussd && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.ussd}</p>
          )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
                Image
            </Label>
            <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                    handleChange("image", ev.target?.result as string) // store Base64 or blob URL
                    }
                    reader.readAsDataURL(file)
                }
                }}
                className="col-span-3"
                
            />
            
          </div>
        </div>

        <DialogFooter className="flex justify-between ">
            <DialogClose asChild>
                <Button className="hover:bg-[#C0D2D3]" variant="outline" data-slot="dialog-close"> Cancel </Button>
            </DialogClose>
            
            <div className="min-w-[260px]"></div>
            <Button className="bg-[#0D5256]" onClick={handleSubmit}>Save Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOfferDialog;