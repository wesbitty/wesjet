import { FC } from 'react'
import React from 'react'

export const Button: FC<{ title: string }> = ({ title }) => (
  <div
    style={{ padding: 2, backgroundColor: '#333', color: '#fff', display: 'grid', borderRadius: 4 }}
    onClick={() => alert('Hi')}
  >
    {title}
  </div>
)