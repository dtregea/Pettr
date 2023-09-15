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
    docker-compose run --rm -p 50000:50000 app npm run build
    ;;

  clean)
    docker-compose run --rm -p 50000:50000 app npm run clean
    ;;

  *)
    echo "Usage: $0 {server|ui|test|build|clean}"
    exit 1
esac
