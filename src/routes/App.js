import MainLayout from '../components/MainLayout';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Login from './Login';
import {connect} from 'dva';
const App = ({children})=>{
  return (
    <LocaleProvider locale={zhCN}>
      {
        window.location.pathname === "/login" ?
        <Login />
        :
        <MainLayout>
        {children}
      </MainLayout>
      }
    </LocaleProvider>
  )
};

export default App;
