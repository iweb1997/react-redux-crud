import React from 'react';
import {connect} from 'react-redux'
import {fetchAllUsersAction,editModalAction,updateUserData,deleteUserData} from '../../redux/actions/user';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import swal from 'sweetalert';


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

class Users extends React.Component{
    constructor(){
      super();
      this.state = {
        searchQuery: ''
      }
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

    deleteUser(userId){
      swal({
        title: "Are you sure?",
        text: "You want to delete the user?",
        icon: "warning",
        dangerMode: true,
        buttons: true
      })
      .then(willDelete => {
        if (willDelete) {
          this.props.deleteUserAction(userId,this.props.users)
        }
      })
    }

    onSubmit(values) {
      this.props.updateUserAction(values,this.props.users);
    }

    searchAction = ({ target }) => {
      this.setState({ searchQuery: target.value })
    }

    filterUsers = (searchQuery) => {

      if (!searchQuery ) {
        return this.props.users
      } 

      return this.props.users.filter(user => {
          const stringContains = new RegExp(searchQuery, 'i');
          return stringContains.test(user.first_name) || stringContains.test(user.last_name) || stringContains.test(user.email)
      })
    }

    render(){
      console.log('rendering')
        var {project_title,fetch_users_loading,edit_modal_opened,fetch_users_error,handleSubmit,updating_user_pending,total_users,users_per_page,current_page} = this.props;

        const users = this.filterUsers(this.state.searchQuery)

        var pageNumbers = [];
        var renderPageNumbers = [];

        if (total_users !== null) {
          for (let i = 1; i <= Math.ceil(total_users / users_per_page); i++) {
            pageNumbers.push(i);
          }

          renderPageNumbers = pageNumbers.map(number => {
            let classes = current_page === number ? 'page-item active' : 'page-item';

            return (
                <li key={number} className={classes}>
                  <a className="page-link" href="#" onClick={(e)=>this.props.fetchUsersAction(e,number)}>{number}</a>
                </li>
            );
          });
        }

        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <h3> Project is about ({project_title})</h3>
                    </div>
                   
                    <div className="row mt-5">
                      <div className="col-sm">
                      {
                        (fetch_users_loading)?
                          <button className="btn btn-secondary" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                              Fetching...
                          </button>
                          :
                          <button className="btn btn-secondary" onClick={(e)=>this.props.fetchUsersAction(e,1)}>Fetch Users Data</button>
                      }
                      </div>
                      <div className="col-sm">
                        <input type="text" className="form-control" placeholder="Search here..." onChange={this.searchAction} value={this.state.searchQuery} />
                      </div>
                    </div>
                    
                    <div className="row mt-5 table-responsive">
                        <table className="table table-hover table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Sr. No</th>
                              <th scope="col">User Id</th>
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
                                        <td colSpan="7">
                                            <img src="/images/loader1.gif" style={{height:'50px',width:'50px'}} className="img-fluid" alt="loading"/>
                                        </td>
                                    </tr>
                                :
                                (users.length>0)?
                                    users.map((item,index)=>(
                                        <tr key={item.id}>
                                             <td>{index+1}</td>
                                             <td>{item.id}</td>           
                                             <td>{item.first_name}</td>           
                                             <td>{item.last_name}</td>           
                                             <td>{item.email}</td>           
                                             <td>
                                                 <img src={item.avatar} height="50" width="50" alt="avatar"/>
                                             </td>
                                             <td>
                                              <button type="button" className="btn btn-primary" onClick={()=>this.fillFormValuesAndEditPopup(item)}>Edit</button>
                                              <button type="button" className="btn btn-danger ml-1" onClick={()=>this.deleteUser(item.id)}>Remove</button>
                                             </td>                                             
                                        </tr>
                                    ))
                                :
                                <tr>
                                {
                                    (fetch_users_error)?
                                        <td colSpan="7">Error while fetching users data!</td>
                                    :
                                        <td colSpan="7">No users found!</td>
                                }   
                                </tr>
                            }
                          </tbody>
                        </table>

                          <ul className="pagination">
                            {renderPageNumbers}
                          </ul>
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
                              {
                                (updating_user_pending)?
                                  <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                     Updating...
                                  </button>
                                :                                
                                <button className="btn btn-primary">Update</button>
                              }
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
  
  if(!values.first_name){
    errors.first_name = 'First name is required!'
  }
  if(!values.last_name){
    errors.last_name = 'Last name is required!'
  }
  if(!values.email){
    errors.email = 'Email address is required!'
  }else if(!values.email && !regex.test(values.email)){
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

let UpdateForm = reduxForm(config)(Users);

const mapStateToProps = (state) =>{
    return{
        project_title: state.global.project_title,
        users: state.usersData.users,
        fetch_users_loading: state.usersData.is_users_data_loading,
        fetch_users_error:state.usersData.error,
        edit_modal_opened: state.usersData.edit_modal_opened,
        updating_user_pending: state.usersData.updating_user_pending,
        total_users:state.usersData.total_users,
        users_per_page:state.usersData.users_per_page,
        current_page:state.usersData.current_page
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        fetchUsersAction: (e,pageNumber) => {e.preventDefault(); dispatch(fetchAllUsersAction(pageNumber))},
        editPopupAction: (bool)=>{dispatch(editModalAction(bool))},
        updateUserAction: (data,users)=>{dispatch(updateUserData(data,users))},
        deleteUserAction: (userId,users)=>{dispatch(deleteUserData(userId,users))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(UpdateForm);