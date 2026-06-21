import React from 'react'

export default function Wip({ title }: any) {
  return (
    <>
        <h1>{String(title).charAt(0).toUpperCase() + String(title).slice(1)}</h1>
        <h3>This page is currently under development.</h3>
    </>
  )
}
