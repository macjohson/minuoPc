import dva from 'dva';
import './index.css';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';

// 全局配置
window.animationType = {
  list:"right",
  form:"left"
}

// 1. Initialize
const app = dva({
  ...createLoading({
    effects:true
  }),
  history:createHistory()
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/App'));
app.model(require('./models/user'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
