export function debounce(callback:any, delay:number){
    let timer: any;
    return (...args:any) =>{
        clearTimeout(timer);
        timer = setTimeout(()=>callback(...args),delay)
    }

}