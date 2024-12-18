import { TextField } from '@mui/material'
import React from 'react'

export default function InputProtocolo({ value, setValue, label, placeholder, readOnly, shrink }) {
  return (
    <TextField
        className='m-0'
        margin="normal"
        required
        fullWidth
        type="text"
        id="protocolo"
        label={label}
        name="protocolo"
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e)=>{setValue(e.target.value)}}
        inputProps={{readOnly: readOnly}}
        InputLabelProps={{ shrink: shrink }}
    />
  )
}
