"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useAddUpdateBlogsCategoryDialog } from "@/context/add-update-blogs-category-dialog-context";
import { AddBlogsCategory } from "@/actions/blog/categories/set";
import { UpdateBlogsCategory } from "@/actions/blog/categories/update";

type DataType = {
  id: string;
  name: string;
  namefr: string;
  namear: string;
};


export const AddUpdateBlogsCategoryDialog = () => {
  const translate = useTranslations("BlogsCategories");
  const { isOpen, closeDialog, isAdd, data } = useAddUpdateBlogsCategoryDialog();
  const [loading, setLoading] = useState(false);
  const origin = useOrigin()


  const schema = z.object({
    name: z.string().min(1, translate("namerequired")),
    namefr: z.string().optional().refine((name) => !name || name.length > 1 || name==="", translate("namerequired")),
    namear: z.string().optional().refine((name) => !name || name.length > 1 || name==="", translate("namerequired")),
  })

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      namefr: "",
      namear: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name ?? "");
      form.setValue("namefr", data.namefr ?? "");
      form.setValue("namear", data.namear ?? "");
    }
  }, [data])

  const onSubmit = async (dataFrom: FormValues) => {
    if (!origin) return
    setLoading(true);
    let res;
    let message;
    let status;

    if (isAdd) {
      res = await AddBlogsCategory(dataFrom.name,dataFrom.namefr??"",dataFrom.namear??"");
    } else if(data) {
      res = await UpdateBlogsCategory(data.id,dataFrom.name,dataFrom.namefr??"",dataFrom.namear??"");
    } else {
      toast.error("Error");
      return
    }
    
    status = res.status;message = res.data.message
    setLoading(false);

    if (status === 200) {
      toast.success(message);
      closeDialog();
      form.reset();
    } else {
      toast.error(message);
    }
  };

  const handleClose = () => {
    closeDialog();
    setLoading(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!w-[330px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{isAdd ? translate("addcategory") : translate("updatecategory")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate("name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={translate("nameplaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name Fr */}
            <FormField
              control={form.control}
              name="namefr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate("namefr")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={translate("nameplaceholderfr")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name Ar */}
            <FormField
              control={form.control}
              name="namear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate("namear")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={translate("nameplaceholderar")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button type="submit" className={`w-full mt-4`}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAdd ? translate("addcategory") : translate("updatecategory")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};