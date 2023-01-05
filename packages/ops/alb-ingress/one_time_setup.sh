# Must be run with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY set to a user/role with proper permissions to access the EKS cluster
CLUSTER_NAME=nothingprojects-lazarus

eksctl utils associate-iam-oidc-provider --cluster=$CLUSTER_NAME --region us-east-1 --approve

kubectl create secret docker-registry regcred \
  --docker-server=389959444765.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1)

aws iam create-role \
  --role-name myLazarusAmazonEKSNodeRole \
  --assume-role-policy-document file://"node-role-trust-policy.json"
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy \
  --role-name myLazarusAmazonEKSNodeRole
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly \
  --role-name myLazarusAmazonEKSNodeRole

aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy \
  --role-name myLazarusAmazonEKSNodeRole

# https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html

aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

eksctl create iamserviceaccount \
  --cluster=nothingprojects-lazarus \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name "AmazonEKSLoadBalancerControllerRole" \
  --attach-policy-arn=arn:aws:iam::389959444765:policy/AWSLoadBalancerControllerIAMPolicy \
  --region us-east-1 \
  --approve

# MUST TAG ALL SUBNETS WITH
# kubernetes.io/cluster/nothingprojects-lazarus
# kubernetes.io/role/elb
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/aws-alb-ingress-controller/v1.1.9/docs/examples/rbac-role.yaml
curl -o iam_policy.json  https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy --policy-name ALBIngressControllerIAMPolicy --policy-document file://iam_policy.json
eksctl create iamserviceaccount \
       --cluster=$CLUSTER_NAME \
       --namespace=kube-system \
       --name=aws-load-balancer-controller \
       --attach-policy-arn="arn:aws:iam::389959444765:policy/ALBIngressControllerIAMPolicy" \
       --override-existing-serviceaccounts \
       --approve \
       --region us-east-1

helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=$CLUSTER_NAME --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller

# verify started
kubectl logs -n kube-system $(kubectl get po -n kube-system | egrep -o alb-ingress[a-zA-Z0-9-]+)