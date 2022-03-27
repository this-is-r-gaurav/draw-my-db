import { DefinePlugin } from "webpack";
export default {
    mode: 'development',
    devServer: {
      port: 3000,
    },
    webpack: {
        plugins: {
          add: [
            new DefinePlugin({
              process: {env: {
                NODE_ENV: "'development'"
              }}
            }),
          ],
        }
      }
  };