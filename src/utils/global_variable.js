//全局变量
import { counsellorRequestId } from '@/api/login'

//开始
function requestSignIn(request_project_path, request_param){
	const data = {
		request_type: 1,
		request_project: 1,
		request_project_path,
		request_param
	}
	counsellorRequestId(data).then(res => {
    if(res.code == 200){
    	const id = res.result.counsellor_request_id;
    	localStorage.setItem('counsellor_request_id', id)
    }
	})
}

//结束
export function requestOver(request_project_path, request_param){
	const counsellor_request_id = localStorage.getItem('counsellor_request_id');
	if (counsellor_request_id) {
		const data = {
			request_type: 2,
			request_project: 1,
			request_project_path,
			request_param,
			counsellor_request_id
		}
		counsellorRequestId(data).then(res => {
	    if(res.code == 200){
	    }
		})
	}
	requestSignIn(request_project_path,request_param);
}