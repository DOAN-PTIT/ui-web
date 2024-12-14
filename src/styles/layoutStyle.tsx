
'use client'

import { useAppSelector } from "@/store";
import tw from "tailwind-styled-components";
export const LayoutStyled = tw.div`
  min-h-screen rounded-t-lg overflow-auto overflow-x-hidden p-5 gap-5
`


export const marginStyle = (className: string) => {
  const collapsed = useAppSelector((state) => state.shopReducer.collapsed);
  const plus = collapsed ? 60 : 200;
  return (
    <style jsx global>
      {`
        .${className} {
          margin-left: ${plus}px;
          transition: all 0.2s, background 0s;
        }
      `}
    </style>
  )
}