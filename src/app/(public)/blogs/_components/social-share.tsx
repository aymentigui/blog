// components/my/public/social-share.tsx
"use client";

import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Link as LinkIcon, 
  Share2 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface SocialShareProps {
  title: string;
  description?: string;
  url: string;
}

const SocialShare = ({ title, description, url }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslations("BlogPage")

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct sharing API, usually redirects to app
        toast(translate("copylinkinstagramerror"));
        copyToClipboard();
        return;
      case "copy":
        copyToClipboard();
        return;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(translate("copylinksuccess"));
    } catch (err) {
      toast.error(translate("copylinkerror"));
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 size={16} />
          <span>{translate("share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
          <Facebook size={16} className="mr-2 text-blue-600" />
          <span>{translate("facebook")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
          <Twitter size={16} className="mr-2 text-blue-400" />
          <span>{translate("twitter")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
          <Linkedin size={16} className="mr-2 text-blue-700" />
          <span>{translate("linkedin")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("instagram")} className="cursor-pointer">
          <Instagram size={16} className="mr-2 text-pink-600" />
          <span>{translate("instagram")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
          <LinkIcon size={16} className="mr-2" />
          <span>{translate("copylink")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;