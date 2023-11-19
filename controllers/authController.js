import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config({ path: './config.env' });

class AuthController {
  kakaoLogin = async (req, res) => {
    const { code } = req.body;

    const kakaoResponse = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${code}`
    );

    const kakaoUserAccessToken = kakaoResponse.data.access_token;
    const kakaoUserResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoUserAccessToken}`,
      },
    });

    const name = kakaoUserResponse.data.properties.nickname;
    const profileImage = kakaoUserResponse.data.properties.profile_image;
    const email = kakaoUserResponse.data.kakao_account.email;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Access Token: ', kakaoUserAccessToken);

      return res.status(200).json({
        status: 'success',
        message: '카카오 로그인 성공',
        accessToken: kakaoUserAccessToken,
        user: existingUser,
      });
    } else {
      const newUser = await User.create({
        name,
        profileImage,
        email,
      });

      console.log('Access Token: ', kakaoUserAccessToken);

      res.status(201).json({
        status: 'success',
        message: '카카오 로그인 성공',
        accessToken: kakaoUserAccessToken,
        user: newUser,
      });
    }
  };

  verifyKakaoToken = async (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ message: '[verifyKakaoToken] 액세스 토큰이 없습니다.' });
    }

    try {
      const validationResponse = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 만약 유효하지 않은 토큰이면 에러를 발생시킵니다.
      if (validationResponse.data.expiresInMillis < 0) {
        return res.status(401).json({ message: '[verifyKakaoToken] 유효하지 않은 토큰입니다.' });
      }

      const kakaoUserResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!kakaoUserResponse) {
        return res.status(401).json({ message: '인증되지 않는 유저입니다. 다시 로그인해주십시오.' });
      }

      const email = kakaoUserResponse.data.kakao_account.email;
      const userFound = await User.findOne({ email });

      req.user = userFound;

      // 토큰이 유효하면 다음 미들웨어로 이동합니다.
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: '토큰 유효성 검사 중 오류가 발생했습니다.' });
    }
  };

  kakaoLogout = async (req, res) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ message: '[kakaoLogout] 액세스 토큰이 없습니다.' });
    }

    try {
      await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Logout Success');
      return res.status(200).json({ message: '카카오 로그아웃 성공' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ headers: req.headers, message: '카카오 로그아웃 중 오류가 발생했습니다.' });
    }
  };
}

export default AuthController;
