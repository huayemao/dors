import { BaseButtonIcon } from '@shuriken-ui/react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'

export const CopyToClipboard = ({
  getValue,
  ...props
}: {
  getValue: () => string
} & ComponentProps<'button'>): ReactElement => {
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timerId = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied])

  const handleClick = useCallback<
    NonNullable<ComponentProps<'button'>['onClick']>
  >(async () => {
    setCopied(true)
    if (!navigator?.clipboard) {
      console.error('Access to clipboard rejected!')
    }
    try {
      await navigator.clipboard.writeText(getValue())
    } catch {
      console.error('Failed to copy!')
    }
  }, [getValue])

  const IconToUse = isCopied ? CheckIcon : CopyIcon

  return (
    /* @ts-ignore */
    <BaseButtonIcon size='sm' onClick={handleClick} title="Copy code" tabIndex={0} {...props}>
      <IconToUse className="h-4 w-4" />
    </BaseButtonIcon>
  )
}
