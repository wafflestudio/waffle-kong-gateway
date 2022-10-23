FROM kong/kong-gateway:3.0.0.0-alpine
USER root

COPY ./plugins /usr/local/kong/js-plugins
RUN apk update && apk add nodejs npm && npm install --prefix /usr/local/kong/js-plugins && npm install -g kong-pdk@0.5.3

USER kong

ENV KONG_PLUGINS=bundled,waffle-jwt-authorizer \
    KONG_PLUGINSERVER_NAMES=js \
    KONG_PLUGINSERVER_JS_SOCKET=/usr/local/kong/js_pluginserver.sock \
    KONG_PLUGINSERVER_JS_START_CMD="/usr/local/bin/kong-js-pluginserver -v --plugins-directory /usr/local/kong/js-plugins" \
    KONG_PLUGINSERVER_JS_QUERY_CMD="/usr/local/bin/kong-js-pluginserver --plugins-directory /usr/local/kong/js-plugins --dump-all-plugins"

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["kong", "docker-start"]
