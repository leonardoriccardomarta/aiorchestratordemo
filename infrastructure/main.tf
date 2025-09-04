terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "your-terraform-state"
    key    = "state/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  environment = var.environment
}

# EKS Cluster
module "eks" {
  source = "./modules/eks"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  environment = var.environment
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnet_ids
  environment = var.environment
}

# ElastiCache Redis
module "redis" {
  source = "./modules/redis"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnet_ids
  environment = var.environment
}

# S3 Buckets
module "s3" {
  source = "./modules/s3"
  environment = var.environment
}

# CloudFront CDN
module "cdn" {
  source = "./modules/cdn"
  s3_bucket_id = module.s3.frontend_bucket_id
  environment = var.environment
}

# Route53 DNS
module "dns" {
  source = "./modules/dns"
  domain_name = var.domain_name
  environment = var.environment
}

# ACM SSL Certificates
module "acm" {
  source = "./modules/acm"
  domain_name = var.domain_name
  environment = var.environment
}

# ElasticSearch
module "elasticsearch" {
  source = "./modules/elasticsearch"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnet_ids
  environment = var.environment
}

# SQS Queues
module "sqs" {
  source = "./modules/sqs"
  environment = var.environment
}

# WAF Web Application Firewall
module "waf" {
  source = "./modules/waf"
  environment = var.environment
}

# Monitoring and Alerting
module "monitoring" {
  source = "./modules/monitoring"
  environment = var.environment
} 