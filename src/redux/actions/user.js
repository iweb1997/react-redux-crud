import {displayToasterMessage} from '../../Components/Toaster/';
import {
    FETCH_ALL_USERS_PENDING,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_ERROR,
    OPEN_EDIT_MODAL,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILED,
    DELETE_USER_PENDING,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILED
} from './action-types';

function fetchAllUsersPending() {
    return {
        type: FETCH_ALL_USERS_PENDING
    }
}

function fetchAllUsersSuccess(usersData){
    return {
        type: FETCH_ALL_USERS_SUCCESS,
        users_data: usersData
    }
}

function fetchAllUsersError(){
    return{
        type: FETCH_ALL_USERS_ERROR
    }
}

export function fetchAllUsersAction(pageNumber) {
    return function(dispatch){
        dispatch(fetchAllUsersPending());
        fetch('https://reqres.in/api/users?page='+pageNumber)
            .then(res=>res.json())
            .then(json=>{
                dispatch(fetchAllUsersSuccess(json));
            })
            .catch(error=>{
                displayToasterMessage('error','Network request failed!');
                dispatch(fetchAllUsersError());
            })        
    }
}

export function editModalAction(bool){
    return{
        type: OPEN_EDIT_MODAL,
        payload:bool
    }
}

function updateUserPending(){
    return{
        type: UPDATE_USER_PENDING
    }
}

function updateUserSuccess(updatedUsers){
    displayToasterMessage('success','User updated successfully!');
    return{
        type: UPDATE_USER_SUCCESS,
        payload:{users:updatedUsers}
    }
}

function updateUserFailed(){
    displayToasterMessage('error','An error occured while updating the user!');
    return{
        type: UPDATE_USER_FAILED
    }
}

export function updateUserData(data,users){
    return function(dispatch){
        dispatch(updateUserPending());
        fetch('https://reqres.in/api/users/'+data.user_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        .then(res => res.json())
        .then(json => {
            for (var i in users) {
                if (users[i].id === data.user_id) {
                    users[i].first_name = data.first_name;
                    users[i].last_name = data.last_name;
                    users[i].email = data.email;
                    break;
                }
            }
            dispatch(updateUserSuccess(users));
        })
        .catch(error => {
            console.log(error);
            dispatch(updateUserFailed())
        });
    }
}

function deleteUserPending(){
    return{
        type: DELETE_USER_PENDING
    }
}

function deleteUserSuccess(newUsers){
    displayToasterMessage('success','User deleted successfully!');
    return{
        type: DELETE_USER_SUCCESS,
        payload:{users:newUsers}
    }
}

function deleteUserFailed(){
    displayToasterMessage('error','An error occured while deleting the user!');
    return{
        type: DELETE_USER_FAILED
    }
}

export function deleteUserData(userId,users){
    return function(dispatch){
        dispatch(deleteUserPending());
        fetch('https://reqres.in/api/users/'+userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            } 
        })
        .then(res => {
            if(res.ok && res.status===204){
                let newUsers = users.filter(user=> user.id!==userId)
                dispatch(deleteUserSuccess(newUsers));
            }
        })
        .catch(error => {
            console.log(error);
            dispatch(deleteUserFailed())
        });
    }
}