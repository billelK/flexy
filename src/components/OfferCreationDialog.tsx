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
import {useApp} from "@/context/AppContext";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect } from "react"
import FileUploader from "@/components/FileUploader"



export function CreateOfferDialog() {
  const {offerForm, resetForm, errors, open, setOpen, handleSubmit, handleChange, isCreation, setIsCreation } = useApp();

  const onCreate = () => { 
    if (!isCreation) {
      setIsCreation(true)
    }
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={onCreate} className='bg-[#0D5256]'><FiPlusCircle className="h-5 w-5" color="white"/>Create Offer</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#0D5256]"> {isCreation? "Create new Offer": "Update Offer"}</DialogTitle>
          <DialogDescription>
            Add a new offer, fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operator" className="text-right">
              Operator *
            </Label>
            <Select value={offerForm.operator} onValueChange={v => handleChange("operator", v)}>
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
              value={offerForm.title}
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
              value={offerForm.description}
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
              value={offerForm.price}
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
              id="ussd_code"
              value={offerForm.ussd_code}
              onChange={e => handleChange("ussd_code", e.target.value)}
              className="col-span-3"
            />
            {errors.ussd_code && (
            <p className="col-span-4 text-sm text-red-500 text-right">{errors.ussd_code}</p>
          )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left text-sm font-medium">Image</Label>
            <div className="col-span-2">
              <FileUploader
                value={offerForm.image}
                operator={offerForm.operator}
                onChange={(img) => handleChange("image", img)}
              />
            </div>
          </div>
      </div>

        <DialogFooter className="flex justify-between ">
            <DialogClose asChild>
                <Button onClick={() => {resetForm()}} className="hover:bg-[#f4f4f5]" variant="outline" data-slot="dialog-close"> Cancel </Button>
            </DialogClose>
            
            <div className="min-w-[260px]"></div>
            <Button className="bg-[#0D5256]" onClick={handleSubmit}>Save Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOfferDialog;