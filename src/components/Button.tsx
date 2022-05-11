import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

//get the button props from that file
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};


// there: <Button type="submit" />
// here: props.type = submit

export function Button({ isOutlined = false, ...props}: ButtonProps) {
    return (
        <button className={`button ${isOutlined && 'outlined'}`} {...props} />
    )
}