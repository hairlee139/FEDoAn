// import React, { useState } from 'react';
// import { UserOutlined, MailOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';

// const CustomizedContent = () => {
//   // Giả sử có dữ liệu người dùng như sau
//   const userData = {
//     name: 'Người Dùng',
//     email: 'nguoidung@example.com',
//     loginTime: '10:30 AM',
//     activeUsers: 1,
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '500px' }}>
//       {/* Giao diện lịch */}
//       <div style={{ width: '200px', height: '200px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         {/* Hiển thị lịch ở đây */}
//         <span>Lịch</span>
//       </div>

//       {/* Giao diện info box */}
//       <div style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
//         <div style={{ marginBottom: '10px' }}>
//           <UserOutlined />
//           <span style={{ marginLeft: '5px' }}>{userData.name}</span>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <MailOutlined />
//           <span style={{ marginLeft: '5px' }}>{userData.email}</span>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <ClockCircleOutlined />
//           <span style={{ marginLeft: '5px' }}>{userData.loginTime}</span>
//         </div>
//         <div>
//           <TeamOutlined />
//           <span style={{ marginLeft: '5px' }}>Số lượng người đang hoạt động: {userData.activeUsers}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomizedContent;
// import React, { useState, useEffect } from 'react';
// import { UserOutlined, MailOutlined, CrownOutlined } from '@ant-design/icons';
// import { getDetailsUser } from '../../../services/UserService';

// const UserInfoBox = ({ userId, accessToken }) => {
//   const [userDetails, setUserDetails] = useState({
//     name: '',
//     email: '',
//   });

//   useEffect(() => {
//     // Call the API to get user details based on the provided user ID and access token
//     fetchUserDetails();
//   }, [userId, accessToken]);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await getDetailsUser(userId, accessToken);
//       if (response.status === 'OK' && response.data) {
//         const { name, email } = response.data;
//         setUserDetails({ name, email });
//       }
//     } catch (error) {
//       // Handle error here
//       console.error('Error fetching user details:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>User Information</h2>
//       <p>Name: {userDetails.name}</p>
//       <p>Email: {userDetails.email}</p>
//     </div>
//   );
// };

// export default UserInfoBox;
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import * as UserService from '../../../services/UserService'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import Loading from '../../../components/LoadingComponent/Loading'
import * as message from '../../../components/Message/Message'
import { updateUser } from '../../../redux/slides/userSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined} from '@ant-design/icons'
import { getBase64 } from '../../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })

    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={phone} onChange={handleOnchangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar"/>
                        )}
                        {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Address</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage