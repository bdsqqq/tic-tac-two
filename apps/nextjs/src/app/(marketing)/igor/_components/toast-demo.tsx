"use client"

import { Button } from "@haxiom/ui/button"
import { ToastAction } from "@haxiom/ui/toast"
import { useToast } from "@haxiom/ui/use-toast"

export function ToastDemo() {
   const { toast } = useToast()

   return (
      <div>
         <Button
            options={{
               variant: "outline"
            }}
            onClick={() => {
               toast({
                  title: "You did... ",
                  description: "Something??",
                  action: (
                     <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                  ),
               })
            }}
         >
            Do something
         </Button>

         <Button
            options={{
               variant: "outline",
               intent: "destructive"
            }}
            onClick={() => {
               toast({
                  title: "Something went wrong",
                  description: "Very dangerous error",
                  action: (
                     <ToastAction options={{
                        intent: "destructive"
                     }} altText="Fix dangerous error">Fix</ToastAction>
                  ),
                  variant: "destructive"
               })
            }}
         >
            Fire error!
         </Button>
      </div>
   )
}
