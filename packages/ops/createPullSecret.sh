kubectl delete secret regcred
kubectl create secret docker-registry regcred \
  --docker-server=389959444765.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1 --profile nothing)

kubectl delete secret servicesecrets
kubectl apply -f serviceSecrets.yaml