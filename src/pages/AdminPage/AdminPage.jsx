import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, SettingOutlined, LogoutOutlined, LockOutlined, AppstoreAddOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAmin';
import * as OrderService from '../../services/OrderService'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'

import CustomizedContent from './components/CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import Loading from '../../components/LoadingComponent/Loading';

const AdminPage = () => {
  const user = useSelector((state) => state?.user)

  const items = [
    {
      label: 'Hệ thống',
      key: 'system',
      icon: <AppstoreOutlined />,
      children: [
        {
          label: 'Quản lý',
          key: 'management',
          icon: <SettingOutlined />,
          children: [
            getItem('Đăng xuất', 'logout', <LogoutOutlined />),
            getItem('Đổi mật khẩu', 'changepassword', <LockOutlined />),
            getItem('Tham số hệ thống', 'systemparams', <AppstoreAddOutlined />)
          ]
        },
        getItem('Người dùng', 'users', <UserOutlined />),
      ],
    },
    
    // getItem('Sản phẩm', 'products', <AppstoreOutlined />),
    // getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    {
      label: 'Quản lý Danh mục',
      key: '0',
      icon: <AppstoreOutlined />,
      children: [
        {
          label: 'Tổ chức và nhân sự',
          key: '7',
          icon: <SettingOutlined />,
          children: [
            getItem('Danh mục cấp bậc', '1', <AppstoreAddOutlined />),
            getItem('Danh mục chức vụ', '2', <AppstoreAddOutlined />),
            getItem('Danh mục học hàm', '3', <AppstoreAddOutlined />),
            getItem('Danh mục C.Danh CMKT', '4', <AppstoreAddOutlined />),
            getItem('Danh mục Loại đơn vị', '5', <AppstoreAddOutlined />),
            getItem('Danh mục Hình thức Khen thưởng', '6', <AppstoreAddOutlined />),
            getItem('Danh mục Hình thức Kỷ luật', '8', <AppstoreAddOutlined />),
          ]
        },
        {
          label: 'Danh mục chung',
          key: '9',
          icon: <SettingOutlined />,
          children: [
            getItem('Danh mục Tỉnh', '10', <AppstoreAddOutlined />),
            getItem('Danh mục Huyện', '11', <AppstoreAddOutlined />),
            getItem('Danh mục Xã', '12', <AppstoreAddOutlined />),
            getItem('Danh mục Dân tộc', '13', <AppstoreAddOutlined />),
            getItem('Danh mục Tôn giáo', '14', <AppstoreAddOutlined />),
            getItem('Danh mục Khu vực ƯT', '15', <AppstoreAddOutlined />),
            getItem('Danh mục Chế độ ƯT', '16', <AppstoreAddOutlined />),
          ]
        },
      ],
    },
    {
      label: 'Quản lý Quân nhân',
      key: 'quanlyquannhan',
      icon: <AppstoreOutlined />,
      children: [
        {
          label: 'Hồ sơ Cán bộ',
          key: 'hosocanbo',
          icon: <SettingOutlined />,
          children: [
            getItem('Cập nhật hồ sơ cán bộ', 'capbac', <AppstoreAddOutlined />),
            getItem('In danh sách cán bộ', 'quannhans', <AppstoreAddOutlined />),
            getItem('Cập nhật Hồ sơ cán bộ theo đơn vị', 'capnhathscb', <AppstoreAddOutlined />),
            getItem('Quá trình công tác', 'congtac', <AppstoreAddOutlined />),
            getItem('Quá trình cấp bậc', 'capbac', <AppstoreAddOutlined />),
            getItem('Quá trình đào tạo', 'daotao', <AppstoreAddOutlined />),
            getItem('Quá trình khen thưởng', 'khenthuong', <AppstoreAddOutlined />),
            getItem('Quá trình kỷ luật', 'kyluat', <AppstoreAddOutlined />),
            getItem('Tìm kiếm', 'timkiem', <AppstoreAddOutlined />),
          ]
        },
        getItem('Điểu chuyển cán bộ', 'dieuchuyen', <UserOutlined />),
      ],
    },
    {
      label: 'Quản lý Đơn vị',
      key: 'donvis',
      icon: <AppstoreOutlined />,
      children: [
        getItem('Danh mục đơn vị', 'capbac', <LogoutOutlined />),
        getItem('Hồ sơ cán bộ', 'hscb', <LockOutlined />),
        getItem('Tìm kiếm hồ sơ cán bộ', 'timkiemhscb', <AppstoreAddOutlined />),
        getItem('Quản lý nhu cầu/biên chế', 'quanlynhucaubc', <UserOutlined />),
      ],
    },
    {
      label: 'Chỉ huy/ Điều hành',
      key: 'chihuydieuhanh',
      icon: <AppstoreOutlined />,
      children: [
        getItem('Báo cáo nhanh số lượng/ biên chế', 'slbc', <LogoutOutlined />),
        getItem('Báo cáo nhanh số lượng/ cấp bậc', 'slcb', <LockOutlined />),
        getItem('Báo cáo nhanh số lượng/ CD-KH', 'slcdkh', <AppstoreAddOutlined />),
        getItem('Báo cáo nhanh số lượng/ độ tuổi', 'sldotuoi', <UserOutlined />),
        getItem('Báo cáo nhanh số lượng/ ngành', 'slnganh', <UserOutlined />),
      ],
    },
    {
      label: 'Quản lý nghiệp vụ',
      key: 'quanlynghiepvu',
      icon: <AppstoreOutlined />,
      children: [
        getItem('Quản lý giảng dạy nghiên cứu', 'giangday', <AppstoreAddOutlined />)
      ],
    },
  ];

  const [keySelected, setKeySelected] = useState('');
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return {data: res?.data, key: 'orders'}
  }

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    console.log('res1', res)
    return {data: res?.data, key: 'products'}
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    console.log('res', res)
    return {data: res?.data, key: 'users'}
  }
  const getAllQuanNhan = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    console.log('res', res)
    return {data: res?.data, key: 'quannhans'}
  }

  const queries = useQueries({
    queries: [
      {queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60},
      {queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60},
      {queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60},
      // {queryKey: ['quannhans'], queryFn: getAllQuanNhan, staleTime: 1000 * 60},
    ]
  })
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if(queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
    return result
    } catch (error) {
      return result
    }
  },[queries])
  const COLORS = {
   users: ['#e66465', '#9198e5'],
   products: ['#a8c0ff', '#3f2b96'],
   orders: ['#11998e', '#38ef7d'],
  //  quannhans: ['#11998e', '#38ef7d'],
  };

  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'orders':
        return (
          <OrderAdmin />
        )
      case 'quannhans':
        return (
          <AdminUser />
        )  
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }
  console.log('memoCount', memoCount)
  return (
    <>
      


      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex',overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          style={{
            width: 240,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh',
            backgroundColor: '#222D32'
          }}
          items={items}
          onClick={handleOnCLick}
          theme="dark"
          inlineIndent={10}
        />
        <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
          <Loading isLoading={memoCount && Object.keys(memoCount) &&  Object.keys(memoCount).length !== 3}>
            {!keySelected && (
              <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />
            )}
          </Loading>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage
