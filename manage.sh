#!/bin/sh

case "$1" in
  server)
    docker-compose run --rm -p 50000:50000 app npm start
    ;;

  ui)
    docker-compose run --rm -p 50001:3000 ui npm run ui
    ;;
  
  test)
    docker-compose run --rm -p 50000:50000 app npm run test
    ;;

  build)
    docker-compose run --rm -p 50000:50000 app npm run build:ui
    ;;

  clean)
    docker-compose run --rm -p 50000:50000 app npm run clean
    ;;

  update)
    docker-compose run --rm -p 50000:50000 app npm update
    ;;

  *)
    echo "Usage: $0 {server|ui|test|build|clean|update}"
    exit 1
esac
