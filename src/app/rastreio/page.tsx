'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RastreioPage() {
  const [orderId, setOrderId] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de rastreio seria implementada aqui
    // Por enquanto, apenas exibimos um alerta.
    alert(`Rastreando pedido: ${orderId}`);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Rastrear Pedido</CardTitle>
          <CardDescription>
            Insira o código do seu pedido para ver o status atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="order-id">Código do Pedido</Label>
              <Input
                id="order-id"
                placeholder="Ex: #ABC-12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Rastrear
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
