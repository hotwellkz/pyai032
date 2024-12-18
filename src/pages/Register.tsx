import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showGift, setShowGift] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Регистрация | PyAI Teacher';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      setUser(user);
      
      // Отправляем письмо для подтверждения
      await sendEmailVerification(user);
      
      // Сохраняем email пользователя в Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        tokens: 100,
        createdAt: new Date().toISOString(),
        emailVerified: false
      });
      setTokens(100);
      setShowGift(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (showGift) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 text-center animate-fade-in">
                <div className="mb-6 inline-block">
                  <Gift className="w-16 h-16 text-blue-400 animate-bounce" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Добро пожаловать в мир Python!
                </h2>
                
                <p className="text-blue-100 mb-6">
                  Мы подарили вам 100 токенов для начала обучения. Исследуйте возможности
                  нашей платформы и станьте профессиональным Python-разработчиком!
                </p>

                <button
                  onClick={() => navigate('/curriculum')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Начать обучение
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Регистрация
              </h1>

              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Зарегистрироваться
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">или</span>
                  </div>
                </div>
                
                <GoogleAuthButton />
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                </div>
              </form>

              <p className="mt-6 text-center text-slate-600">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-600">
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}