'use client'
import useThreads from '@/hooks/use-threads'
import { api } from '@/trpc/react'
import React from 'react'
import Avatar from 'react-avatar'
import Select from "react-select"
type Props = {
    placeholder: string,
    label: string,

    onChange: (values: { label: string, value: string }[]) => void
    value: { label: string, value: string }

}

const TagInput = ({ placeholder, label, onChange, value }: Props) => {
    const { accountId } = useThreads()
    const { data: suggestions } = api.account.getSuggestions.useQuery({
        accountId
    })

    const [inputValue, setInputValue] = React.useState<string>("")


    const options = suggestions?.map(s => ({
        label: (
            <span className='flex items-center gap-2'>
                <Avatar name={s.address} size="25" textSizeRatio={2} round={true} />
                {s.address}
            </span>
        ),
        value: s.address
    }))


    return (
        <div className='border rounded-md flex items-center'>
            <span className='ml-3 text-sm text-gray-500'>
                {label}
            </span>
            <Select
                onInputChange={setInputValue}
                value={value}
                className='w-4 flex-1'
                classNames={
                    {
                        control: () => {
                            return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent'
                        },
                        multiValue: () => {
                            return 'dark:!bg-gray-700'
                        },
                        multiValueLabel: () => {
                            return 'dark:text-white dark:bg-gray-700 rounded-md'
                        }
                    }
                }
                // @ts-ignore
                onChange={onChange}
                // @ts-ignore
                options={inputValue ? options?.concat({
                    // @ts-ignore
                    label: inputValue, value: inputValue
                }) : options}
                placeholder={placeholder}
                // @ts-ignore
                isMulti
                classNamePrefix="select"
            />
        </div>
    )
}

export default TagInput