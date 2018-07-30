<div class="navi-bar" x-render="navi-bar">
  <div class="navi" x-render="navi">
    <div class="logo">
      <img class="logo-img" src="{{m.navi.logoSrc}}" />
    </div>
    <ul class="navi-links" x-repeat="m.navi.links">
      <li class="navi-link-item{{m.navi.currentPath === m.navi.links[$0].url || m.activeName === m.navi.links[$0].name ? ' current' : ''}}">
        <a class="navi-link-anchor" href="{{m.navi.links[$0].url}}">{{m.navi.links[$0].name}}</a>
      </li>
    </ul>
  </div>
  <div class="login-box" x-if="{{!m.userInfo.uid}}">
    <button class="btn btn-n01" x-event="login">登录</button>
    <button class="btn btn-n02" x-event="regist">注册</button>
  </div>
  <div class="login-info">
    <!--<span>欢迎您，{{m.userInfo.nickname || m.userInfo.mobile}}</span>-->
    <div class="user-info" x-if="{{!!m.userInfo.uid}}" v-x="{{true}}">
      <span>欢迎您，</span>
      <span class="user-info-menu">
      <span class="nick-name">{{m.userInfo.nickname || m.userInfo.mobile}}</span>
      <span class="menu-arrow"></span>
      <div class="menu-drap-down">
        <ul>
          <li>
            <a href="/setting/account">账号信息</a>
          </li>
          <li>
            <a href="/user/myorder">我的订单</a>
          </li>
          <li>
            <a href="/user/financial">申请发票</a>
          </li>
          <li>
            <a href="/logout">退出登录</a>
          </li>
        </ul>
      </div>
    </span>
    </div>
  </div>
</div>