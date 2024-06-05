import React, { ReactNode } from 'react'

export const CommandsContainer = (props: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      className="commands"
    >
      {props.children}
    </div>
  )
}
