import React from 'react';
import {connect} from 'react-redux'
import {fetchAllUsersAction,editModalAction,updateUserData} from '../redux/actions/user';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';

const mapStateToProps = (state) =>{
    return{
        project_title: state.global.project_title,
        users: state.usersData.users,
        fetch_users_loading: state.usersData.is_users_data_loading,
        fetch_users_error:state.usersData.error,
        edit_modal_opened: state.usersData.edit_modal_opened,
        user_update_success: state.usersData.user_update_success,
        updating_user_pending: state.usersData.updating_user_pending
    }
}

const mapDispatchToProps = (dispatch,props) =>{
    return{
        fetchUsersAction: () => {dispatch(fetchAllUsersAction())},
        editPopupAction: (bool)=>{dispatch(editModalAction(bool))},
        updateUserAction: (data,users) =>{dispatch(updateUserData(data,users))}
    }
}

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error }
}) => (
  <div>
      <input {...input} className="form-control" placeholder={label} type={type} />
      {
        touched &&
        (error && <span className="form-error-message">{error}</span>)
      }
  </div>
);

class Counter extends React.Component{
    constructor(){
      super();
      this.onSubmit = this.onSubmit.bind(this);
    }

    fillFormValuesAndEditPopup(userData){
      this.props.editPopupAction(this.props.edit_modal_opened)
      let data = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email
      }
      this.props.initialize(data);
      this.props.change('user_id', userData.id)
    }

    onSubmit(values) {
      this.props.updateUserAction(values,this.props.users);
    }

    render(){
        let {project_title,users,fetch_users_loading,edit_modal_opened,fetch_users_error,handleSubmit,user_update_success,updating_user_pending,show_notification} = this.props;

        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <h3> Project is about ({project_title})</h3>
                    </div>
                   
                    <div className="row mt-3">
                        <button className="btn btn-secondary" onClick={()=>this.props.fetchUsersAction()}>Fetch Users Data</button>
                    </div>
                    
                    <div className="row mt-5 table-responsive">
                        <table className="table table-hover table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">First Name</th>
                              <th scope="col">Last Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Avatar</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                                (fetch_users_loading)?
                                    <tr>
                                        <td colSpan="6">
                                            <img src="/images/loader1.gif" style={{height:'50px',width:'50px'}} className="img-fluid" alt="loading"/>
                                        </td>
                                    </tr>
                                :
                                (users.length>0)?
                                    users.map((item,index)=>(
                                        <tr key={item.id}>
                                             <td>{item.id}</td>           
                                             <td>{item.first_name}</td>           
                                             <td>{item.last_name}</td>           
                                             <td>{item.email}</td>           
                                             <td>
                                                 <img src={item.avatar} className="img-fluid" alt="avatar"/>
                                             </td>
                                             <td>
                                              <button type="button" className="btn btn-primary" onClick={()=>this.fillFormValuesAndEditPopup(item)}>Edit</button>
                                              <button type="button" className="btn btn-danger ml-1">Remove</button>
                                             </td>                                             
                                        </tr>
                                    ))
                                :
                                <tr>
                                {
                                    (fetch_users_error)?
                                        <td colSpan="6">Error while fetching users data!</td>
                                    :
                                        <td colSpan="6">No users found!</td>
                                }   
                                </tr>
                            }
                          </tbody>
                        </table>
                    </div>

                    <div>
                      <Modal isOpen={edit_modal_opened} toggle={()=>this.props.editPopupAction(edit_modal_opened)}>
                        <ModalHeader toggle={()=>this.props.editPopupAction(edit_modal_opened)}>Update User Details</ModalHeader>
                        <ModalBody>
                          <form className="form" onSubmit={handleSubmit(this.onSubmit)}>
                              <div className="form-group">
                                <label className="label">First Name</label>
                                <Field className="form-control" name="first_name" component={renderField} type="text" />
                              </div>

                              <div className="form-group">
                                <label className="label">Last Name</label>
                                <Field className="form-control" name="last_name" component={renderField} type="text" />
                              </div>

                              <div className="form-group">
                                <label className="label">Email</label>
                                <Field className="form-control" name="email" component={renderField} type="email" />
                              </div>

                              <button className="btn btn-primary">
                                {(updating_user_pending)?'Submitting...':'Submit'}</button>
                          </form>
                        </ModalBody>
                      </Modal>
                    </div>
                </div>
            </React.Fragment>            
        );
    }
}

const validate = values => {
  const errors = {}
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  
  if (values.email && !regex.test(values.email)) {
    errors.email = 'Invalid email address'
  } 
  return errors
}

const config = {
  form: 'updateUserDetails',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
}

let updateForm = reduxForm(config)(Counter);

export default connect(mapStateToProps,mapDispatchToProps)(updateForm);