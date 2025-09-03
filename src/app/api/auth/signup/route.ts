import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Signup API called')
    
    const body = await request.json()
    console.log('📝 Request body parsed:', { email: body.email, hasName: !!body.name })
    
    const { email, name, password } = body

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('🔍 About to check existing user')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    console.log('✅ Existing user check complete:', !!existingUser)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      })

      // Create associated profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          email: user.email,
          displayName: user.name,
          preferences: {}
        }
      })

      return { user, profile }
    })

    console.log('🎉 User and profile created successfully:', result.user.id)

    return NextResponse.json(
      { 
        success: true,
        user: { 
          id: result.user.id, 
          email: result.user.email,
          name: result.user.name
        },
        message: 'Account created successfully!'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Signup error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    })
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
