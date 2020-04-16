import { toast } from "react-toastify";


export function displayToasterMessage(type,message){
	return type==='success'? toast.success(message,{autoClose:3000}) : toast.error(message,{autoClose:3000})
}