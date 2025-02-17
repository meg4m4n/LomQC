import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          QC Manager
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                email_input_placeholder: 'Seu email',
                password_input_placeholder: 'Sua senha',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                email_input_placeholder: 'Seu email',
                password_input_placeholder: 'Sua senha',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Login;