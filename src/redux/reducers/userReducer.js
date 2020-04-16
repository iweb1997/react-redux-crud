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
} from '../actions/action-types';


const initialState = {
    is_users_data_loading: false,
    users: [],
    error: null,
    edit_modal_opened:false,
    updating_user_pending:false,
    total_users: null,
    users_per_page: null,
    current_page: null    
}

const userReducer = function(state = initialState, action) {
    switch(action.type) {
        case FETCH_ALL_USERS_PENDING: 
            return {
                ...state,
                is_users_data_loading: true
            }
        case FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                is_users_data_loading: false,
                users: action.users_data.data,
                total_users: action.users_data.total,
                users_per_page: action.users_data.per_page,
                current_page: action.users_data.page                   
            }
        case FETCH_ALL_USERS_ERROR:
            return {
                ...state,
                is_users_data_loading: false,
                error: true
            }
        case OPEN_EDIT_MODAL:
            return {
               ...state,
               edit_modal_opened: !action.payload
            }
        case UPDATE_USER_PENDING:
            return {
               ...state,
               updating_user_pending: true
            }
        case UPDATE_USER_SUCCESS:
            return {
               ...state,
               updating_user_pending: false,
               edit_modal_opened: false,
               users:action.payload.users
            }
        case UPDATE_USER_FAILED:
            return {
               ...state,
               updating_user_pending: false,
               edit_modal_opened: false
            }                                    
        case DELETE_USER_PENDING:
            return {
               ...state,
               updating_user_pending: true
            }
        case DELETE_USER_SUCCESS:
            return {
               ...state,
               updating_user_pending: false,
               users:action.payload.users
            }
        case DELETE_USER_FAILED:
            return {
               ...state,
               updating_user_pending: false
            }                    
        default: 
            return state;
    }
}

export default userReducer;