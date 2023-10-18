export type TypeUsers = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string; //(String no formato ano-mês-dia T hora:minuto:segundo:milésimo-de-segundos Z
  };
  
  export type TypeProducts = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  