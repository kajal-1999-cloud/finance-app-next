"use client";

import { updateDefaultAccount } from '@/actions/accounts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useFetch } from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { startTransition, useEffect } from 'react'
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const { name, type, balance, id, iseDefault } = account;
    // console.log("account", account)

    const { loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,

    } = useFetch(updateDefaultAccount);
    const handleDefaultChange = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (iseDefault) {
            toast.warning("You need atleast 1 default account");
            return;
        }

        const response = await updateDefaultFn(id);

    //         startTransition(async () => {
    //   const response = await updateDefaultAccount(id);
    //   if (response.success) {
    //     toast.success("Default account updated successfully");
    //   } else {
    //     toast.error(response.error || "Failed to update Default account");
    //   }
    // });

        // console.log("response ----", response)
    }
    useEffect(() => {
        if (updatedAccount?.success) {
            console.log("success default account update", updateDefaultAccount)
            toast.success("Default account updated successfully");
        }
    }, [updatedAccount, updateDefaultAccount])

    useEffect(() => {
        if (error) {
            console.log("error default account update", error.message)

            toast.error(error.message || "Failed to update Default account");
        }
    }, [error])
    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
                    <Switch checked={iseDefault}
                        onClick={handleDefaultChange}
                    // disabled={updateDefaultLoading}
                    />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        ${parseFloat(balance).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>

                        {type?.charAt(0) + type?.slice(1).toLowerCase()}
                        Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className='flex items-center'>
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard
