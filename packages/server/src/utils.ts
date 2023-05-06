export const getElasticError = (data: any) => {
    if (data?.meta?.body?.error) {
        return new Error(JSON.stringify(data.meta.body.error))
    }

    return undefined
}

export const valueBetween = (value: number | string | undefined | null, from: number, to: number)=>{
    if(value === null || value === undefined || value === ''){
        return true
    }

    const parsedValue = parseFloat(value.toString())

    if(!Number.isNaN(parsedValue) && value <= to && value >= from ){
        return true
    }

    return false
}
