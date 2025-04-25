"use client"

import * as React from "react"
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { useSession } from "@/hooks/use-session"

export function UserRegisterLogin() {
  const translate = useTranslations("System")
  const { session } = useSession()
  console.log(session)

  const handleThemeChange = (theme: string) => {
  }

  return (
    <>
      {!session|| !session.data || !session.data.user|| !session.data.user.id ?
        <Button className="w-auto flex px-3 " variant="outline" size="icon">
          <span className=" h-[1.2rem] transition-all rotate-0 scale-100">{translate("registerorlogin")}</span>
        </Button>
        :
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-auto flex px-3 " variant="outline" size="icon">
              <span className=" h-[1.2rem] transition-all rotate-0 scale-100">{session.data.user.username??session.data.user.firstname + " "+ session.data.user.lastname}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleThemeChange("light")}>
              {translate("dashboard")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
              {translate("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("theme-ocean")}>
              {translate("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </>
  )
}
